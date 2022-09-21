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

const loadData = async (page: number = 1) => {
  const response = await fetch(
    `https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page=${page}`
  );

  if (response.status !== 200) {
    const errorMessage = `An error occurred!! ${response.status}`;
    alert(errorMessage);
    // const paging: PagingData = resData?.results[0].paging;
    // dataStore = resData?.results[0][`${currentPage}`];
    // const data: ResultData[] = resData?.results[0][`${currentPage}`];
    // const pageNo = resData?.info.page;
    // pageView.textContent = `Page: ${pageNo}`;
    // if (paging.previous) {
    //   previousBtn.disabled = false;
    // } else {
    //   previousBtn.disabled = true;
    // }

    // for (const n in data) {
    //   const index = Number(n);
    //   const item = data[n];
    //   tableRow[index].setAttribute("data-entryid", item.id);
    //   const firstChild: HTMLElement | any = tableRow[index].children[0];
    //   const secondChild: HTMLElement | any = tableRow[index].children[1];
    //   const thirdChild: HTMLElement | any = tableRow[index].children[2];
    //   firstChild.textContent = item.row;
    //   secondChild.textContent = item.gender;
    //   thirdChild.textContent = item.age;
    // }
  }
  const resData = await response.json();
  return resData;
};

const renderTableData = () => {
  let newNode;
  // console.log('dataStore', dataStore)
  // console.log('tableData', tableData)
  // if (tableData.length > 0) {
  //   for (const n in tableData) {
  //     const index = Number(n);
  //     const item = tableData[n];
  //     const { id, row, gender, age } = item;
  //     tableRow[index].setAttribute("data-entryid", id);
  //     const firstChild: HTMLElement | any = tableRow[index].children[0];
  //     const secondChild: HTMLElement | any = tableRow[index].children[1];
  //     const thirdChild: HTMLElement | any = tableRow[index].children[2];
  //     firstChild.textContent = row;
  //     secondChild.textContent = gender;
  //     thirdChild.textContent = age;
  //   }
  // }

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

async function getData(type: "NEXT" | "PREVIOUS") {
  if (type === "PREVIOUS") {
    loadData(currentPage).then(data => {
      paging = data?.results[0].paging;
      dataStore = data;
      tableData = data?.results[0][`${currentPage}`];
      renderTableData()
    })

  }
  //return the data from cache
  if (type === "NEXT") {
    if (Number(dataStore?.info.page) === currentPage) {
      tableData = dataStore?.results[0][`${currentPage}`];
      renderTableData()
    }
    else {
      loadData(currentPage).then(data => {
        //the api result returns the page number and page number + 1 as keys, we would like to cache it so that we dont make such round trip again
        // let result = Object.values(data?.results[0])
        let result = Object.entries(data?.results[0])
        paging = data?.results[0].paging;
        dataStore = data;
        tableData = data?.results[0][`${currentPage}`];
        renderTableData()
        // type === "NEXT" && currentPage++
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
