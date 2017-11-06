<h1 align="center">
   <img src="https://raw.githubusercontent.com/quarterto/almanac/ad1abcb7aa54d14004c7a754aa185cf80e545bc4/public/images/logo.png" alt="Almanac"><br>

   <a href="http://waffle.io/quarterto/almanac">
      <img alt="Waffle.io - Columns and their card count" src="https://badge.waffle.io/quarterto/almanac.svg?columns=Next%20release,In%20progress">
   </a>
</h1>

## getting started

You'll need node/npm. Install [Meteor](https://www.meteor.com/):

```sh
curl https://install.meteor.com/ | sh
```

Then `npm install` and `npm start` and you're away on [localhost:3000](http://localhost:3000).

## development

the `meteor` server compiles everything in [`client`](/client), [`shared`](/shared) and [`server`](/server). main client entry point is [`client/pages/index.js`](/client/pages/index.js), which sets up routes.

### structure (subject to change)

 - [`client/pages`](/client/pages) for top-level routes
 - [`client/components`](/client/components) for miscellaneous react components (currently no separation between presentation & data components but this will change)
 - [`client/blocks`](/client/blocks) for dashboard components

### dev process

 - create a branch referencing an issue (e.g. `search-#19`) and push it immediately
   - this will mark the issue as In Progress on [Waffle](http://waffle.io/quarterto/almanac)
 - dev dev dev
 - open a Pull Request with `closes #ISSUE` in the title (e.g. `Search (closes #19)`) and request a review
   - this creates a Review App on Heroku for others to test the change
 - once it's been approved, merge it
   - commits to `master` automatically deploy to [staging.almanac.wiki](http://staging.almanac.wiki)
 - we manually promote to [almanac.wiki](http://almanac.wiki) via the Heroku dashboard, or Chatops in the Broken Crown slack.

## licence

Almanac
Copyright (C) 2017 Matt Brennan

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
