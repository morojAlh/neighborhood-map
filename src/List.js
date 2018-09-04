import React, { Component } from 'react';
import fetchJsonp from 'fetch-jsonp'
import {mapStyle} from './mapStyle.js'

let map;
let markers = [], infoWindows = [], links = [], istAPI = [];

class List extends Component {
  constructor(props) {
    super(props);
      this.state = {
        locations :[
            {
              title: 'kungstradgarden',
              location: {lat: 59.3314807, lng: 18.0715013} ,
              category: 'Park',
              tag:'kungstradgarden'
            },
            {
              title: 'Gallerian',
              location: {lat: 59.3312008, lng: 18.0673991} ,
              category: 'Shopping',
              tag:'galleria'
            },
            {
              title: 'Royal Swedish Opera',
              location: {lat: 59.3297318, lng: 18.0704829} ,
              category: 'Entertainment',
              tag:'kungligaoperan'
            },
            {
              title: 'Berzelii Park',
              location: {lat: 59.3325803, lng: 18.0745944},
              category: 'Park',
              tag:'berzeliipark'
            },
            {
              title: 'The Royal Place',
              location: {lat:59.3268215, lng: 18.0717194} ,
              category: 'Entertainment',
              tag:'royalplace'
            },
            {
              title: 'Museum of Medieval Stockholm',
              location: {lat: 59.3282928, lng: 18.070308} ,
              category: 'Museum',
              tag:'museumofmedievalstockholm'
            }
        ],
        map:{},
        category:"All",
        tags:[],
        links:[]
      };
      this.initMap = this.initMap.bind(this);
    }

    componentDidMount() {

        // Load google map API and set initial location
        window.initMap = this.initMap;
        loadMap('https://maps.googleapis.com/maps/api/js?key=AIzaSyCQv4i45Nms1mxMcqGFnfA9RTow2XHWTho&v=3&callback=initMap',function () { })

        /* https://www.instagram.com/developer/endpoints/tags/#get_tags_media_recent, https://www.npmjs.com/package/fetch-jsonp
          fetch Instagram API and get post image and link by tag from this account https://www.instagram.com/morojalh.cs/ */
        this.state.locations.map((location,index) => {
            return fetchJsonp(`https://api.instagram.com/v1/tags/${location.tag}/media/recent?access_token=7996642597.cba7db7.beeac3b6b6bf40ef91d5d26260dba293`)
            .then(response=> response.json()).then(responseJson => {
                istAPI.push(responseJson.data[0].images.standard_resolution.url)
                links.push(responseJson.data[0].link)
                this.findTag(istAPI);
                this.findUrl(links)
          }).catch(error => {
            istAPI.push(null)
            links.push(null)
            this.findTag(istAPI);
            this.findUrl(links)
           console.log(error)})
        })
    }


    componentDidUpdate() {
      const {map,locations,tags,links,category} = this.state;
      let bounds = new window.google.maps.LatLngBounds();
      let locationCategory=locations;

      markers.forEach(mark=> mark.setMap(null)); // set markes null to remove it from the map

      markers=[];
      infoWindows=[];

      // after getting images and links from Instagram API, set the results to locations object
      locations.map((location,index) => {
          locations[index].image =tags[index];
          if (index === 0){
            locations[index].link=links[1];
          }
          else if (index === 1){
            locations[index].link=links[4];
          }
          else if (index === 2){
            locations[index].link=links[0];
          }
          else if (index === 3){
            locations[index].link=links[5];
          }
          else if (index === 4){
            locations[index].link=links[2];
          }
          else if (index === 5){
            locations[index].link=links[3];
          }
          return true;
      })
      console.log(locations);

      // check the user input from the dropdown list
      if (category === "All"){
        locationCategory=locations;
      }
      else {
        locationCategory = locations.filter( m => m.category=== category);
      }

      // for each location set the marker and infoWindow in the map
      locationCategory.map((marker,index) => {
        let contentString;

        if ( marker.image === null || marker.link === null) {
          contentString = `<div id="marke-info"><p tabIndex="0">${marker.title}</p>Sorry there is no content from Instagram</div>`;
        }
        else {
          contentString = `<div id="marke-info"><p tabIndex="0">${marker.title}</p><img tabIndex="0" alt="${marker.title} image" src=${marker.image}><br><a href=${marker.link}>View post in instagram</a></div>`;
        }

        let pushInfo = new window.google.maps.InfoWindow({
          content :contentString,
        });

        let pushMarker = new window.google.maps.Marker({
              map: map,
              position: marker.location,
              title: marker.title,
              tag: marker.tag,
              animation: window.google.maps.Animation.DROP
        });

        markers.push(pushMarker);
        infoWindows.push(pushInfo);

        // when user click to marker the infoWindow will display
        pushMarker.addListener('click', function() {
            infoWindows.forEach(info => {info.close()});
            /* https://stackoverflow.com/questions/14657779/google-maps-bounce-animation-on-marker-for-a-limited-period*/
            pushMarker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(pushMarker.setAnimation(null), 2000);
            pushInfo.open(map,pushMarker);
        });

        markers.forEach(m => bounds.extend(m.position))
        return true;

      });
    }

    // open the infoWindow when user click location from the list
    getInfo = (item, event) => {
      let currentItem = markers.filter(current => current.title === item.title)
      window.google.maps.event.trigger(currentItem[0],'click');
    }

    // set the map in the page
    initMap() {
    var getMap = document.getElementById('map');

    getMap.style.height = window.innerHeight + "px";
    map = new window.google.maps.Map(getMap, {
        center: {lat: 59.3293235, lng: 18.0685808},
        zoom: 15,
        styles: mapStyle
    });

    this.setState({map:map});
    }

    findTag = (tag) => {
      this.setState({ tags:tag.sort() })
    }

    findUrl = (url) => {
      this.setState({ links:url.sort() })
    }

    render() {
      const {locations} = this.state;
      const {category} =this.props;
      this.state.category=category;

      // check the user input from the dropdown list
      let locationCategory=locations;

      if (this.state.category === "All"){
        locationCategory=locations;
      }
      else {
        locationCategory = locations.filter( m => m.category=== this.state.category);
      }

      return (
        <div>
          <ul className="listMarker">
            {locationCategory.map((location, index) =>
            <li
            role="menuitem"
            tabIndex={index+4}
            name={index}
            key={index}
            onClick={this.getInfo.bind(this,location)}
            onKeyPress={this.getInfo.bind(this,location)}>
            {location.title}</li>)}
          </ul>
        </div>
        );
    }
}

export default List;

/* https://github.com/manishbisht/Neighborhood-Map-React/blob/8e1b8bad0210d184c73ef40e6cf146a8f1d2d86a/src/components/App.js#L241
    Load script to the page*/
/**
 * Load the google maps Asynchronously
 * @param {url} url of the google maps script
 */
function loadMap(src,onloadFunction) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = loadError;
    if (onloadFunction) { script.onload = onloadFunction; }
    ref.parentNode.insertBefore(script, ref);
}
function loadError(oError) {
  alert("Failed to load google map API "+ oError.target.src );
}
