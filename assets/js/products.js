import { fetchData, initializer } from "./index.js";

const data = await fetchData("./data/data.json", "product");
initializer(data, data.length);
