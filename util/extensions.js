/**
 * This is global generic request handler, which allow configure sync / async flows of io data operation on
 * the server => http response sending, handling data notfound and promise errors
 * @param dataLoaderFn async callback fetching the data from data storage
 * @param renderFn callback handling httpresponse
 * @param res response express library object
 * @param syncPredicate predicate  defining sync/async flow of the function
 * @returns void
 */
const genericRequestHandler = (dataLoaderFn, renderFn, res, syncPredicate) => {
  (async () => {
    try {
      if (syncPredicate()) {
        const data = await dataLoaderFn();
        if (data) {
          renderFn(data);
        } else {
          res
            .status(404)
            .render("404", { pageTitle: "Page Not Found", path: "404" });
        }
      } else {
        dataLoaderFn();
        renderFn();
      }
    } catch (error) {
      throw Error(error);
    }
  })().catch(err => res.status(500).send(err));
};
module.exports = genericRequestHandler;
