class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    let keyword = this.queryStr.category
      ? {
          category: this.queryStr.category,
        }
      : {};

    let priceGt = this.queryStr.priceGt ? Number(this.queryStr.priceGt) : 0;
    let priceLt = this.queryStr.priceLt ? Number(this.queryStr.priceLt) : 0;
    if (priceGt > 0 && priceLt > priceGt) {
      keyword = {
        ...keyword,
        price: {
          $gt: priceGt,
          $lt: priceLt,
        },
      };
    }
    this.query = this.query.find({ ...keyword });
    return this;
  }
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}
export default ApiFeatures;
