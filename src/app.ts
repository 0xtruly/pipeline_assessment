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

enum PageEnum {
  next = "NEXT",
  previous = "PREVIOUS"
}

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

let currentPage: number = 1;

const initiateRequest = async (page: number = 1) => {
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

  newNode = tableData && tableData.map((item: ResultData) => {
    const { id, row, gender, age } = item;
    return `
    <tr data-entryid="${id}">
    <td>${row}</td>
    <td>${age}</td>
    <td>${gender}</td>
    </tr>
    `
  });
  if (pageView && tableBody) {
    pageView.textContent = `Showing Page ${currentPage}`;
    tableBody.innerHTML = newNode.join("").toString()
  }
}

const getData = (type: PageEnum) => {

  if (type === "PREVIOUS") {
    initiateRequest(currentPage).then(data => {
      paging = data?.results[0].paging;
      dataStore = data;
      tableData = data?.results[0][`${currentPage}`];
      renderTableData()
    })

  }
  if (type === "NEXT") {
    if (Number(dataStore?.info.page) === currentPage) {
      tableData = dataStore?.results[0][`${currentPage}`];
      renderTableData()
    }
    else {
      initiateRequest(currentPage).then(data => {
        paging = data?.results[0].paging;
        dataStore = data;
        tableData = data?.results[0][`${currentPage}`];
        renderTableData()
      });
    }
  }
}

previousBtn.addEventListener("click", async () => {
  if (currentPage === 1) {
    return currentPage;
  } else {
    currentPage--;
  }
  getData(PageEnum.previous);
});
nextBtn.addEventListener("click", async () => {
  currentPage++;
  getData(PageEnum.next);
});

getData("NEXT");
const startApp = async () => {
};

document.addEventListener("DOMContentLoaded", startApp);
