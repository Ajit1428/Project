class ApiFeatures {
    /* Using constructor to be able to access the vairable within the class */
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search = () => {
        /* Fetching the keyword from query */
        const keywords = this.queryStr.keyword
            ? {
                /* Searching the products using name */
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: "i",
                  },
              }
            : {};

        this.query = this.query.find({ ...keywords });
        return this;
    };

    filter = () => {
        const queryCopy = { ...this.queryStr };

        /* Category Filter */
        const removeFields = ["keyword", "limit", "page"];
        removeFields.map((key) => delete queryCopy[key])

        /* Price Filter */
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    };

    pagination = (resultPerPage) => {
        /* Fetching the current page */
        let currentPage = Number(this.queryStr.page) || 1;

         /* Logic to skip the page */
        let skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    };
}

export default ApiFeatures;
