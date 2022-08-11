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

let previousBtn: HTMLElement | any = document.querySelector("button[data-prevbtn]");
let nextBtn: HTMLElement | any = document.querySelector("button[data-nextbtn]");
let pageView: HTMLElement | any = document.querySelector("label[data-pageview]");
let tableBody: HTMLElement | any = document.querySelector("tbody[data-sink]");
let currentPage: number = 1;

const paginate = () => {
  previousBtn.disabled = true;
  previousBtn.style.color = 'black';
  previousBtn.style.backgroundColor = 'gray';
  pageView.innerHTML = `Page: ${currentPage}`;
  previousBtn.addEventListener('click', async () => {
    if (currentPage === 1) {
      return currentPage;
    } else {
      currentPage--;
    }
    pageView.innerHTML = `Page: ${currentPage}`;
    tableBody.innerHTML = "";
    await loadData(currentPage);
  });
  nextBtn.addEventListener('click', async () => {
    currentPage++;
    pageView.innerHTML = `Page: ${currentPage}`;
    tableBody.innerHTML = '';
    await loadData(currentPage);
  });
};

const loadData = async (page: number = 1) => {
  const response = await fetch(
    `https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page=${page}`,
  );

  if (response.status === 200) {
    const resData = await response.json();
    const paging: PagingData = resData?.results[0].paging;
    const data: ResultData[] = resData?.results[0][`${currentPage}`];
    if (paging.previous) {
      previousBtn.disabled = false;
      previousBtn.style.color = '#04AA6D';
    }

    // for (const n of data) {
    //   // console.log('n', n)
    //   const tR = document.querySelector(`tbody > tr:nth-child(${n.row})`);
    //   const firstChild = document.querySelector(`tbody > tr:nth-child(${n.row}) > td:first-child`);
    //   const secondChild = document.querySelector(`tbody > tr:nth-child(${n.row}) > td:nth-child(2)`);
    //   const thirdChild = document.querySelector(`tbody > tr:nth-child(${n.row}) > td:nth-child(3)`);
    //   firstChild.innerHTML = n.row;
    //   secondChild.innerHTML = n.gender;
    //   thirdChild.innerHTML = n.age;
    //   console.log('tR', tR)
    //   console.log('secondChild', secondChild)
    //   tR?.setAttribute('data-entryId', n.id);

    // }

    for (let i = 0; i < data?.length; i++) {
      const row = data[i];
      let tr = document.createElement('tr');
      tr?.setAttribute('data-entryId', row.id);
      tr.innerHTML = `
                <td id=${row.id}>${row.row}</td>
                <td>${row.gender}</td>
                <td>${row.age}</td>`;
      tableBody.appendChild(tr);
    }
  }
};

const startApp = async () => {
  paginate();
  await loadData();
};

document.addEventListener('DOMContentLoaded', startApp);
