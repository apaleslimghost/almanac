<h1 align="center">
   <img src="/public/images/logo.svg" alt="Almanac" width="300"><br>

   <a href="http://waffle.io/quarterto/almanac">
      <img alt="Waffle.io - Columns and their card count" src="https://badge.waffle.io/quarterto/almanac.svg?columns=In%20progress">
   </a>

   <a href="https://travis-ci.com/quarterto/almanac">
      <img alt="Build status" src="https://travis-ci.org/quarterto/almanac.svg?branch=master">
   </a>
</h1>

## getting started

You'll need node/npm. Install [Meteor](https://www.meteor.com/):

```sh
curl https://install.meteor.com/ | sh
```

Then `npm install` and `npm start` and you're away on [localhost:3000](http://localhost:3000).

## development

the `meteor` server compiles everything in [`client`](/client), [`shared`](/shared) and [`server`](/server). main client entry point is [`client/pages/main.js`](/client/pages/main.js), which sets up routes.

### structure

 - [`client/pages`](/client/pages) for top-level routes
 - [`client/blocks`](/client/blocks) for dashboard components
 - [`client/documents`](/client/documents) for components that represent a single database item
 - [`client/collections`](/client/collections) for components that represent a list of database items
 - [`client/control`](/client/control) for misc form-control-esque components
 - [`client/visual`](/client/visual) for purely visual/presentational components
 - [`client/data`](/client/data) for data-fetching higher-order-components

### dev process

 - create a branch referencing an issue (e.g. `search-#19`) and push it immediately
   - this will mark the issue as In Progress on [Waffle](http://waffle.io/quarterto/almanac)
 - dev dev dev
 - open a Pull Request with `closes #ISSUE` in the title (e.g. `Search (closes #19)`) and request a review
   - this creates a Review App on Heroku for others to test the change
 - once it's been approved, merge it
   - commits to `master` automatically deploy to [almanac.wiki](https://almanac.wiki)

## licence

Almanac
Copyright (C) 2018 Matt Brennan

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
