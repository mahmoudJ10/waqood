import { fetchData, initializer } from "./index.js";
const data = await fetchData("./data/data.json", "allProducts");
initializer(data, data.length);
