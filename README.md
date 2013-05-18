Redditmon
=========

A tool for monitoring and storing number of readers on subreddit, and a simple web interface for visualizing the data between intervals of time in order ti have insight about the best time to share your content. The project is composes of two parts the "worker" and the "webapp".

### Worker
A Python module that runs as a service on a server and fetches the data related to the selected subreddits every interval of time and writes to the database.

### Webapp
A single page application with Python's Flask as a back-end and modular javascript for the front-end, along with using jQuery and Underscore. Fetches the data from database based on a form query and displays results on a chart with detail view for points.

Setup
------
Coming soon

License
-------
Copyright (C) 2013 Ayman Farhat

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
