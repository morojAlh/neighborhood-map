# Neighborhood Map

## Table of Contents
* [Introduction to the project](#introduction-to-the-project)
* [Instructions](#instructions)
* [Usage](#usage)

## Introduction to the project
  This project is a single page application featuring a map of a neighborhood in Stockholm, Sweden. You can see a list of places in Stockholm and you can filter them by category (Park, Shopping, Entertainment, Museum), And if you click in a specific location you will get some information about it.
  In this project, I used Instagram API to get images and links to the post to get more informations to the user.

## Instructions
  To open the project follow these steps:
  - Clone this project
  - Run `npm install`
  - Run `npm start`

## Usage
  - `fetch-jsonp`
    JSONP is NOT supported in standard Fetch API. fetch-jsonp provides you same API to fetch JSONP like native Fetch, also comes with global fetchJsonp function. [For More](https://www.npmjs.com/package/fetch-jsonp)
  - `classnames`
    A simple JavaScript utility for conditionally joining classNames together. [For More](https://www.npmjs.com/package/classnames)
  - Custom google map style from [Here](https://mapstyle.withgoogle.com)
  - Instagram API to get media by `tag-name`
    ```
    https://api.instagram.com/v1/tags/{tag-name}/media/recent?access_token=ACCESS-TOKEN
    ```
