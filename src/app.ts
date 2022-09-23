interface ResponseData {
  results: {
    [key: number]: ResultData[];
    paging?: PagingData;
  }[];
  info: {
    page: string;
  };
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

enum PagingEnum {
  next = "NEXT",
  previous = "PREVIOUS",
}

let dataStore: ResponseData;
let tableData: ResultData[] = [];

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
let baseUrl: string = 'https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84'

const loadData = async (url: string) => {
  const response = await fetch(url);

  if (response.status !== 200) {
    const errorMessage = `An error occurred!! ${response.status}`;
    alert(errorMessage);
  }
  const resData = await response.json();
  return resData;
};

const renderTableData = () => {
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

    if (currentPage === 1) {
      previousBtn.disabled = true;
    } else {
      previousBtn.disabled = false;
    }
  }
}

async function getData(type: PagingEnum) {
  const url = dataStore?.results[0]?.paging?.next ?? `${baseUrl}&page=${currentPage}`
  if (type === "PREVIOUS") {
    if (Number(dataStore?.info.page) === 1) {
      tableData = dataStore?.results[0][`${currentPage}`];
      renderTableData();
    }
    else {
      loadData(dataStore?.results[0]?.paging?.previous).then((data) => {
        dataStore = data;
        tableData = data?.results[0][`${currentPage}`];
        renderTableData();
      });
    }
  }

  if (type === "NEXT") {
    if (Number(dataStore?.info.page) + 1 === currentPage) {
      tableData = dataStore?.results[0][`${currentPage}`];
      renderTableData()
    }
    else {
      loadData(url).then((data) => {
        dataStore = data;
        tableData = data?.results[0][`${currentPage}`];
        renderTableData();
      });
    }
  }
}

previousBtn.addEventListener("click", async () => {
  currentPage--;
  getData(PagingEnum.previous);
});
nextBtn.addEventListener("click", async () => {
  currentPage++;
  getData(PagingEnum.next);
});

getData(PagingEnum.next);
const startApp = async() => {
};

document.addEventListener("DOMContentLoaded", startApp);