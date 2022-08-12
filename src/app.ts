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

let previousBtn: HTMLElement | any = document.querySelector(
  "button[data-prevbtn]"
);
let nextBtn: HTMLElement | any = document.querySelector(
  "button[data-nextbtn]"
);
let pageView: HTMLElement | any = document.querySelector(
  "label[data-pageview]"
);
const tableRow: HTMLElement | any = document.querySelectorAll(
  `tbody[data-sink] > tr`
);
let currentPage: number = 1;

const loadData = async (page: number = 1) => {
  const response = await fetch(
    `https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page=${page}`
  );

  if (response.status === 200) {
    const resData = await response.json();
    const paging: PagingData = resData?.results[0].paging;
    const data: ResultData[] = resData?.results[0][`${currentPage}`];
    const pageNo = resData?.info.page;
    pageView.textContent = `Page: ${pageNo}`;
    if (paging.previous) {
      previousBtn.disabled = false;
    } else {
      previousBtn.disabled = true;
    }

    for (const n in data) {
      const index = Number(n);
      const item = data[n];
      tableRow[index].setAttribute("data-entryid", item.id);
      const firstChild: HTMLElement | any = tableRow[index].children[0];
      const secondChild: HTMLElement | any = tableRow[index].children[1];
      const thirdChild: HTMLElement | any = tableRow[index].children[2];
      firstChild.textContent = item.row;
      secondChild.textContent = item.gender;
      thirdChild.textContent = item.age;
    }
  }
};

const startApp = async () => {
  await loadData();
  previousBtn.addEventListener("click", async () => {
    if (currentPage === 1) {
      return currentPage;
    } else {
      currentPage--;
    }
    await loadData(currentPage);
  });
  nextBtn.addEventListener("click", async () => {
    currentPage++;
    await loadData(currentPage);
  });
};

document.addEventListener("DOMContentLoaded", startApp);
