interface ResponseData {
  results: {
    [key: number]: ResultData[];
    paging?: PagingData;
  }[];
  info: {
    page: string;
  }
}
type ResultData = {
  id: string;
  gender: string;
  age: number;
  row: number;
};

type PagingData = {
  next?: string;
  previous?: string;
};

let dataStore: ResponseData;
let tableData: ResultData[] = [];
let paging: PagingData = {}

let previousBtn: HTMLButtonElement | any = document.querySelector(
  "button[data-prevbtn]"
);
let nextBtn: HTMLButtonElement | any = document.querySelector(
  "button[data-nextbtn]"
);
let pageView: HTMLElement | any = document.querySelector(
  "label[data-pageview]"
);
const tableBody: HTMLElement | any = document.querySelector(
  `[data-sink]`
);
const tableRow: HTMLElement | any = document.querySelectorAll(
  `tbody[data-sink] > tr`
);
let currentPage: number = 1;

const loadData = async (page: number) => {
  const response = await fetch(
    `https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page=${page}`
  );

  if (response.status !== 200) {
    const errorMessage = `An error occurred!! ${response.status}`;
    alert(errorMessage);
  }
  const resData = await response.json();
  return resData;
};

const renderTableData = () => {
  let newNode;
  if (paging.previous) {
    previousBtn.disabled = false;
  } else {
    previousBtn.disabled = true;
  }
  if (pageView && tableBody) {
    for (const n in tableData) {
      const index = Number(n);
      const item = tableData[n];
      tableRow[index].setAttribute("data-entryid", item.id);
      const firstChild: HTMLElement | any = tableRow[index].children[0];
      const secondChild: HTMLElement | any = tableRow[index].children[1];
      const thirdChild: HTMLElement | any = tableRow[index].children[2];
      firstChild.textContent = item.row;
      secondChild.textContent = item.gender;
      thirdChild.textContent = item.age;
    }
    pageView.textContent = `Showing Page ${currentPage}`;
  }
}

async function getData(type: "NEXT" | "PREVIOUS") {
  if (type === "PREVIOUS" && paging.previous) {
    loadData(currentPage).then(data => {
      paging = data?.results[0].paging;
      dataStore = data;
      tableData = data?.results[0][`${currentPage}`];
      renderTableData()
    })
  }

  if (type === "NEXT") {
    if (Number(dataStore?.info.page) === currentPage) {
      tableData = dataStore?.results[1][`${currentPage}`];
      renderTableData()
    }
    else {
      loadData(currentPage).then(data => {
        paging = data?.results[0].paging;
        dataStore = data;
        tableData = data?.results[0][`${currentPage}`];
        renderTableData()
      });
    }
  }
}

previousBtn.addEventListener("click", async () => {
  currentPage--;
  await getData("PREVIOUS");
});
nextBtn.addEventListener("click", async () => {
  currentPage++;
  await getData("NEXT");
});

getData("NEXT");
const startApp = async () => {
};

document.addEventListener("DOMContentLoaded", startApp);