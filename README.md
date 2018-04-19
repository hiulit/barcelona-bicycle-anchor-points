# Barcelona bicycle anchors points

Find public bicycle anchor points near you in Barcelona! [Check it out!](https://hiulit.github.io/barcelona-bicycle-anchor-points/dist/)

![App example](app-example.png)

## Development

* [Download](https://nodejs.org/) and install **Node.js** and **npm**.
* Clone the project `git clone https://github.com/hiulit/barcelona-bicycle-anchor-points.git`.
* Go to the project's folder `cd barcelona-bicycle-anchor-points/`.
* Install dependencies `npm install`.
* Run `grunt`.
* You can choose between:
    * **Develop in a localhost server** - Start the development environment.
    * **Build for production and start a localhost server** - Build the project at `/dist` ready for production and start a localhost server to review changes before uploading the project to production.
    * **Build for production** - Build the project at `/dist` ready for production.
    * **Update bycicle anchor points JSON** - Downloads the JSON from https://w33.bcn.cat/planolBCN/ and saves it to `src/data`.
* Choose **Update bycicle anchor points JSON**.
* Run `grunt` again and choose **Develop in a localhost server**.

## Deployment

* Go to the project's folder `cd barcelona-bicycle-anchor-points/`.
* Run `grunt`.
* Choose **Build for production**.
* Upload the contents of `/dist` to a server.

## API

* [apiHelper](/docs/apiHelper.md)
* [mapHelper](/docs/mapHelper.md)

## Changelog

See [CHANGELOG](/CHANGELOG.md).

# Contributing

See [CONTRIBUTING](/CONTRIBUTING.md).

## Authors

Me 😛 [@hiulit](https://github.com/hiulit).

## License

[MIT License](/LICENSE)
