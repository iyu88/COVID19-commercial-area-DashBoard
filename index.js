const gang_nam = document.getElementById("__gang_nam"); // '강남구' 버튼
const jong_ro = document.getElementById("__jong_ro"); // '종로구' 버튼
const go_back = document.getElementById("__go_back"); // '뒤로가기' 버튼
const switch_btn = document.getElementById("__switch_btn"); // '지도 보기' 버튼
const go_back2 = document.getElementById("__go_back2"); // '메인으로' 버튼
const switch_btn2 = document.getElementById("__switch_btn2"); // '그래프 보기' 버튼
const moves_btns = document.getElementsByClassName("moves_filter"); // 필터 버튼
const all_graph = document.getElementById("__all_graph"); // 그래프 태그
const map_graph = document.getElementById("__map_graph"); // 맵 태그
const options = document.getElementsByClassName("ad_gu"); // 행정구 옵션들
const covid_select = document.getElementsByClassName("__covid_select"); // 확진자 선택 옵션
const img_map = document.getElementById("img_map"); // 지도 이미지
const street_gangnam = document.getElementById("__street_gangnam"); // 강남구 상권 샘플
const street_jongro = document.getElementById("__street_jongro"); // 종로구 상권 샘플
let samples = document.getElementsByClassName("__sample");

let selected_gu = "강남구";
let bar_ratio = [4.2, 4.1, 8.5]; // 초기 비율값
let filter_bar = [5.8, 4.4, 3.8]; // 초기 비율값
let gu_moves_info = {};
let gu_business = {}; // 매출 상위 업종 데이터 저장 object
let gu_covid = {}; // 코로나 확진자 데이터 저장 object
let gu_moves = {}; // 유동인구 데이터 저장 object
let gu_sales = {}; // 총매출 데이터 저장 object
let gu_street = {}; // 상권 데이터 저장 object
let gu_options = []; // 행정구 옵션 저장 배열
let business_street = []; // 상권명 저장 배열

// html 태그에서 행정구 옵션을 가져옵니다
for (let i = 0; i < options.length; i++) {
  gu_options.push(options[i].innerHTML);
}

// html 태그에서 상권명을 가져옵니다
for (let i = 0; i < samples.length; i++) {
  business_street.push(samples[i].innerHTML);
}

for (let i = 0; i < moves_btns.length; i++) {
  moves_btns[i].addEventListener("click", (e) => {
    document
      .getElementsByClassName("__clicked2")[0]
      .classList.remove("__clicked2");
    if (e.target.classList.length === 1) {
      e.target.classList.add("__clicked2");
    }
  });
}

go_back.addEventListener("click", () => {
  all_graph.classList.toggle("__invisible");
  document
    .getElementsByClassName("__clicked2")[0]
    .classList.remove("__clicked2");
  moves_btns[0].classList.add("__clicked2");
  d3.select("input#__covid_default").property("checked", true);
});

switch_btn.addEventListener("click", () => {
  map_graph.classList.toggle("__invisible");
  // 맵 켜짐
  if (selected_gu === "강남구") {
    street_gangnam.classList.remove("__invisible2");
  } else if (selected_gu === "종로구") {
    street_jongro.classList.remove("__invisible2");
  }
});

go_back2.addEventListener("click", () => {
  all_graph.classList.toggle("__invisible");
  map_graph.classList.toggle("__invisible");
  // 맵 꺼짐
  document
    .getElementsByClassName("__clicked2")[0]
    .classList.remove("__clicked2");
  moves_btns[0].classList.add("__clicked2");
  if (selected_gu === "강남구") {
    street_gangnam.classList.add("__invisible2");
  } else if (selected_gu === "종로구") {
    street_jongro.classList.add("__invisible2");
  }
  d3.select("input#__covid_default").property("checked", true);
});

switch_btn2.addEventListener("click", () => {
  map_graph.classList.toggle("__invisible");
  // 맵 꺼짐
  if (selected_gu === "강남구") {
    street_gangnam.classList.add("__invisible2");
  } else if (selected_gu === "종로구") {
    street_jongro.classList.add("__invisible2");
  }
});

gang_nam.addEventListener("click", () => {
  selected_gu = options[0].innerHTML;
  bar_ratio = [4.2, 4.1, 8.5];
  filter_bar = [5.8, 4.4, 3.8];
  img_map.src = "map_gangnam.png";
  d3.select("g#__summary_svg_graph").remove();
  d3.select("g#__upper_svg_graph").remove();
  d3.select("g#__first_svg_graph").remove();
  d3.select("g#__second_svg_graph").remove();
  d3.select("g#__third_svg_graph").remove();
  d3.select("div#__map_title").html(
    "< 서울시 강남구 신사동 신사역 주변 상권 >"
  );
  d3.select("text#__summary_level").remove();
  d3.select("#__summary_moves_txt text").remove();
  d3.select("#__summary_sales_txt text").remove();
  d3.select("g#__seoul_line_svg_graph").remove();
  all_graph.classList.toggle("__invisible");
  read_gu_moves_info(gu_moves_info[selected_gu]);
  read_gu_business(gu_business[selected_gu]);
  read_gu_covid(gu_covid[selected_gu]);
  read_gu_moves(gu_moves[selected_gu]);
  read_gu_sales(gu_sales[selected_gu]);
  let temp_data = [];
  for (let i = 0; i < gu_street[selected_gu].length; i++) {
    if (samples[0].innerHTML === gu_street[selected_gu][i].상권명) {
      temp_data.push(gu_street[selected_gu][i]);
    }
  }
  read_gu_street(temp_data);
  d3.select(".__clicked")
    .style("background-color", "black")
    .style("color", "white");
  document.getElementsByClassName("__clicked")[0].classList.remove("__clicked");
  document.getElementById("sample1").classList.add("__clicked");
  d3.select("#sample1").style("background-color", "red");
});

jong_ro.addEventListener("click", () => {
  selected_gu = options[1].innerHTML;
  bar_ratio = [9, 5.4, 22];
  filter_bar = [19.1, 15, 13.5];
  img_map.src = "map_jongro.png";
  d3.select("g#__summary_svg_graph").remove();
  d3.select("g#__upper_svg_graph").remove();
  d3.select("g#__first_svg_graph").remove();
  d3.select("g#__second_svg_graph").remove();
  d3.select("g#__third_svg_graph").remove();
  d3.select("div#__map_title").html(
    "< 서울시 종로구 창신동 동대문역 주변 상권 >"
  );
  d3.select("text#__summary_level").remove();
  d3.select("#__summary_moves_txt text").remove();
  d3.select("#__summary_sales_txt text").remove();
  d3.select("g#__seoul_line_svg_graph").remove();
  all_graph.classList.toggle("__invisible");
  read_gu_moves_info(gu_moves_info[selected_gu]);
  read_gu_business(gu_business[selected_gu]);
  read_gu_covid(gu_covid[selected_gu]);
  read_gu_moves(gu_moves[selected_gu]);
  read_gu_sales(gu_sales[selected_gu]);
  let temp_data = [];
  for (let i = 0; i < gu_street[selected_gu].length; i++) {
    if (samples[5].innerHTML === gu_street[selected_gu][i].상권명) {
      temp_data.push(gu_street[selected_gu][i]);
    }
  }
  read_gu_street(temp_data);
  d3.select(".__clicked")
    .style("background-color", "black")
    .style("color", "white");
  document.getElementsByClassName("__clicked")[0].classList.remove("__clicked");
  document.getElementById("sample6").classList.add("__clicked");
  d3.select("#sample6")
    .style("background-color", "rgb(102, 194, 165)")
    .style("color", "black");
});

// 상단 그래프의 데이터를 읽고 lineChart() 함수에 전달합니다
d3.csv("up_jong.csv", (error, data) => lineChart(data));

// 반복문을 통해서 gu_business에 각 행정구 정보를 배열에 저장합니다
function lineChart(data) {
  for (let i = 0; i < gu_options.length; i++) {
    gu_business[gu_options[i]] = []; // 행정구 정보를 저장할 배열을 선언합니다
    for (let j = 0; j < data.length; j++) {
      if (data[j].행정구 == gu_options[i]) {
        gu_business[gu_options[i]].push(data[j]); // 데이터 object를 배열에 저장합니다
      }
    }
  }
}

// 전달한 데이터를 꺾은선 그래프로 표시합니다
function read_gu_business(data) {
  /* y축의 최대값 설정을 위한 max_value를 알아내기 위해서 매출 값만 data_array에 저장합니다 */
  let data_array = [];
  for_legend = [data[0].순위1, data[0].순위2, data[0].순위3];

  for (let i = 0; i < data.length; i++) {
    data_array.push(parseInt(data[i].순위1_매출));
  }
  let max_value = d3.max(data_array, (d) => d); // 매출 최대값을 저장합니다. y축의 최대값으로 사용됩니다.

  // __upper_svg 아래에 g 태그를 추가합니다
  d3.select("svg#__upper_svg").append("g").attr("id", "__upper_svg_graph");

  // svg 태그의 부모 태그의 너비와 높이를 구합니다
  // 상하좌우 margin 값을 정의합니다
  width = document.getElementById("__upper_line").offsetWidth;
  height = document.getElementById("__upper_line").offsetHeight;
  margin = { top: 20, left: 20, bottom: 20, right: 20 };
  // margin = { top: height / 10 , left: (width / 10) / 4 , bottom: height / 10 , right: (width / 10) / 4}

  // domain에 실제 데이터 값을 넣고 range에 화면 픽셀 값을 넣습니다
  xScale = d3.scale
    .linear()
    .domain([0, data.length])
    .range([margin.left, width - (margin.left + margin.right) * 5]); // x축 크기
  yScale = d3.scale
    .linear()
    .domain([0, max_value * 1.1])
    .range([
      height - (margin.top + margin.bottom) * 2,
      (margin.top + margin.bottom) * 2,
    ]); // y축 크기

  // x축 정보입니다
  xAxis = d3.svg
    .axis()
    .scale(xScale)
    .orient("bottom")
    .tickSize(height - (margin.top + margin.bottom) * 4) // 높이 길이를 정의합니다
    .tickValues([1, 2, 3, 4, 5, 6, 7, 8]); // tick 개수를 정의합니다

  // x축을 추가하고 위치를 translate 시킵니다
  d3.select("g#__upper_svg_graph")
    .append("g")
    .attr("id", "xAxisG")
    .attr("transform", `translate(0, ${(margin.top + margin.bottom) * 2})`)
    .call(xAxis);

  // y축 정보입니다
  yAxis = d3.svg
    .axis()
    .scale(yScale)
    .orient("right")
    .ticks(8) // tick 개수를 정의합니다
    .tickSize(width - (margin.left + margin.right) * 4) // 너비 길이를 정의합니다
    .tickSubdivide(true);

  // y축을 추가하고 위치를 translate 시킵니다
  d3.select("g#__upper_svg_graph")
    .append("g")
    .attr("id", "yAxisG")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

  // 꺾은선에 대한 x,y 스케일들을 정의합니다
  first_business_Line = d3.svg
    .line()
    .x((d) => xScale(d.시간순))
    .y((d) => yScale(d.순위1_매출));

  second_business_Line = d3.svg
    .line()
    .x((d) => xScale(d.시간순))
    .y((d) => yScale(d.순위2_매출));

  third_business_Line = d3.svg
    .line()
    .x((d) => xScale(d.시간순))
    .y((d) => yScale(d.순위3_매출));

  // 꺾은선을 추가합니다
  d3.select("g#__upper_svg_graph")
    .append("path")
    .attr("id", "first_line")
    .attr("class", for_legend[0])
    .attr("d", first_business_Line(data))
    .attr("fill", "none")
    .attr("stroke", "rgb(252, 141, 98)")
    .attr("stroke-width", 5);

  d3.select("g#__upper_svg_graph")
    .append("path")
    .attr("id", "second_line")
    .attr("class", for_legend[1])
    .attr("d", second_business_Line(data))
    .attr("fill", "none")
    .attr("stroke", "rgb(141, 160, 203)")
    .attr("stroke-width", 5);

  d3.select("g#__upper_svg_graph")
    .append("path")
    .attr("id", "third_line")
    .attr("class", for_legend[2])
    .attr("d", third_business_Line(data))
    .attr("fill", "none")
    .attr("stroke", "rgb(102, 194, 165)")
    .attr("stroke-width", 5);

  // 매출 1순위 데이터를 추가합니다
  d3.select("g#__upper_svg_graph")
    .selectAll("circle.__first_business")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "__first_business")
    .attr("class", for_legend[0])
    .attr("r", 7) // 원의 크기
    .attr("cx", (d) => xScale(d.시간순)) // x 위치
    .attr("cy", (d) => yScale(d.순위1_매출)) // y 위치
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .style("fill", "rgb(252, 141, 98)")
    // 마우스 over 시 tooltip이 보이고 out 시 사라집니다. 마우스 위치에 따라서 tooltip 위치가 바뀝니다.
    .on("mouseover", function () {
      tooltip.style("display", "block");
      d3.select(this).attr("stroke-width", 0).style("fill", "black");
    })
    .on("mouseout", function () {
      tooltip.style("display", "none");
      d3.select(this)
        .attr("stroke-width", 2)
        .style("fill", "rgb(252, 141, 98)");
    })
    .on("mousemove", function (d) {
      tooltip.style("left", d3.event.pageX + 10 + "px");
      tooltip.style("top", d3.event.pageY - 10 + "px");
      tooltip.text(`${d.순위1_매출}`);
    });

  // 매출 2순위 데이터를 추가합니다
  d3.select("g#__upper_svg_graph")
    .selectAll("circle.__second_business")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "__second_business")
    .attr("class", for_legend[1])
    .attr("r", 7) // 원의 크기
    .attr("cx", (d) => xScale(d.시간순)) // x 위치
    .attr("cy", (d) => yScale(d.순위2_매출)) // y 위치
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .style("fill", "rgb(141, 160, 203)")
    // 마우스 over 시 tooltip이 보이고 out 시 사라집니다. 마우스 위치에 따라서 tooltip 위치가 바뀝니다.
    .on("mouseover", function () {
      tooltip.style("display", "block");
      d3.select(this).attr("stroke-width", 0).style("fill", "black");
    })
    .on("mouseout", function () {
      tooltip.style("display", "none");
      d3.select(this)
        .attr("stroke-width", 2)
        .style("fill", "rgb(141, 160, 203)");
    })
    .on("mousemove", function (d) {
      tooltip.style("left", d3.event.pageX + 10 + "px");
      tooltip.style("top", d3.event.pageY - 10 + "px");
      tooltip.text(`${d.순위2_매출}`);
    });

  // 매출 3순위 데이터를 추가합니다
  d3.select("g#__upper_svg_graph")
    .selectAll("circle.__third_business")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "__third_business")
    .attr("class", for_legend[2])
    .attr("r", 7) // 원의 크기
    .attr("cx", (d) => xScale(d.시간순)) // x 위치
    .attr("cy", (d) => yScale(d.순위3_매출)) // y 위치
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .style("fill", "rgb(102, 194, 165)")
    // 마우스 over 시 tooltip이 보이고 out 시 사라집니다. 마우스 위치에 따라서 tooltip 위치가 바뀝니다.
    .on("mouseover", function () {
      tooltip.style("display", "block");
      d3.select(this).attr("stroke-width", 0).style("fill", "black");
    })
    .on("mouseout", function () {
      tooltip.style("display", "none");
      d3.select(this)
        .attr("stroke-width", 2)
        .style("fill", "rgb(102, 194, 165)");
    })
    .on("mousemove", function (d) {
      tooltip.style("left", d3.event.pageX + 10 + "px");
      tooltip.style("top", d3.event.pageY - 10 + "px");
      tooltip.text(`${d.순위3_매출}`);
    });

  // tooltip 의 속성을 설정합니다
  let tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "toolTip")
    .style("display", "none");

  // 그래프에서 표시되는 선들을 회색으로 변경합니다
  d3.selectAll("path.domain")
    .style("fill", "none")
    .style("stroke", "lightgray");

  d3.selectAll("line").style("stroke", "lightgray");

  // y축 제목을 추가하고 속성을 설정해줍니다
  d3.select("g#__upper_svg_graph")
    .append("text")
    .attr("transform", "rotate(90)")
    .attr("x", height / 2)
    .attr("y", -width + (margin.left + margin.right) * 2)
    .attr("text-anchor", "middle")
    .text("총 매출액(천억원)")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // 그래프의 타이틀에 대한 속성을 설정해줍니다
  d3.select("g#__upper_svg_graph")
    .append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", margin.top + margin.bottom)
    .attr("text-anchor", "middle")
    .text(`< ${data[0].행정구} 매출 상위 업종 3가지 >`)
    .style("font-size", "1.3em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // x축 제목을 추가하고 속성을 설정해줍니다
  d3.select("g#__upper_svg_graph")
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - margin.top)
    .attr("text-anchor", "middle")
    .text("기준 연도_분기")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // x축에 표시되는 라벨을 설정합니다
  d3.select("g#xAxisG")
    .selectAll("text")
    .data(data)
    .text((d, i) => `${data[i].기준년도_분기}`);

  // y축 tick 라벨링 데이터를 가져옵니다
  yLabels = document.querySelectorAll("g#yAxisG text");
  let new_yLabels = [];
  for (let i = 0; i < yLabels.length; i++) {
    if (yLabels[i].innerHTML[1] === ",") {
      new_yLabels.push(yLabels[i].innerHTML[0] + yLabels[i].innerHTML[2]);
    } else {
      new_yLabels.push(yLabels[i].innerHTML.substr(0, 1));
    }
  }

  // y축 tick 라벨을 다시 설정합니다
  d3.select("g#yAxisG")
    .selectAll("text")
    .data(new_yLabels)
    .text((d, i) => d);

  d3.select("g#__upper_svg_graph")
    .data(for_legend)
    .append("text")
    .attr("x", width - margin.right * 14)
    .attr("y", (margin.top + margin.bottom) * 1.7)
    .text(for_legend[0])
    .style("font-size", "1em")
    .style("font-weight", "bold")
    .style("fill", "rgb(252, 141, 98)")
    .on("click", (d) => {
      // is the element currently visible ?
      let currentOpacity = d3.selectAll("." + for_legend[0]).style("opacity");
      // Change the opacity: from 0 to 1 or from 1 to 0
      d3.selectAll("." + for_legend[0])
        .transition()
        .style("opacity", currentOpacity == 1 ? 0 : 1);
    });

  d3.select("g#__upper_svg_graph")
    .data(for_legend)
    .append("text")
    .attr("x", width - margin.right * 11)
    .attr("y", (margin.top + margin.bottom) * 1.7)
    .text(for_legend[1])
    .style("font-size", "1em")
    .style("font-weight", "bold")
    .style("fill", "rgb(141, 160, 203)")
    .on("click", (d) => {
      // is the element currently visible ?
      let currentOpacity = d3.selectAll("." + for_legend[1]).style("opacity");
      // Change the opacity: from 0 to 1 or from 1 to 0
      d3.selectAll("." + for_legend[1])
        .transition()
        .style("opacity", currentOpacity == 1 ? 0 : 1);
    });

  d3.select("g#__upper_svg_graph")
    .data(for_legend)
    .append("text")
    .attr("x", width - margin.right * 8)
    .attr("y", (margin.top + margin.bottom) * 1.7)
    .text(for_legend[2])
    .style("font-size", "1em")
    .style("font-weight", "bold")
    .style("fill", "rgb(102, 194, 165)")
    .on("click", (d) => {
      // is the element currently visible ?
      let currentOpacity = d3.selectAll("." + for_legend[2]).style("opacity");
      // Change the opacity: from 0 to 1 or from 1 to 0
      d3.selectAll("." + for_legend[2])
        .transition()
        .style("opacity", currentOpacity == 1 ? 0 : 1);
    });
}

d3.json("moves_info.json", (error, data) => {
  gu_moves_info = data;
  read_gu_moves_info(gu_moves_info[selected_gu]);
});

function read_gu_moves_info(data) {
  /* y축의 최대값 설정을 위한 max_value를 알아내기 위해서 확진자 값만 data_array에 저장합니다 */
  let data_array = [];

  for (let i = 0; i < data[0].요일별.length; i++) {
    data_array.push(parseInt(data[0].요일별[i]));
  }
  let max_value = d3.max(data_array, (d) => d);

  // __summary_svg 아래에 g 태그를 추가합니다
  d3.select("svg#__summary_svg").append("g").attr("id", "__summary_svg_graph");

  // svg 태그의 부모 태그의 너비와 높이를 구합니다
  // 상하좌우 margin 값을 정의합니다
  width = document.getElementById("__summary").offsetWidth;
  height = document.getElementById("__summary").offsetHeight;
  margin = { top: 20, left: 20, bottom: 20, right: 20 };

  // domain에 실제 데이터 값을 넣고 range에 화면 픽셀 값을 넣습니다
  xScale = d3.scale
    .linear()
    .domain([0, max_value * 1.1])
    .range([
      (margin.left + margin.right) * 3.5,
      width - (margin.left + margin.right),
    ]); // y축 크기
  yScale = d3.scale
    .linear()
    .domain([1, data[0].요일별.length])
    .range([height - (margin.top + margin.bottom) * 3, margin.top * 2]); // x축 크기

  // x축 정보입니다
  xAxis = d3.svg
    .axis()
    .scale(xScale)
    .orient("bottom")
    .tickSize(height - (margin.top + margin.bottom) * 3) // 높이 길이를 정의합니다
    .ticks(3)
    .tickSubdivide(true);

  // x축을 추가하고 위치를 translate 시킵니다
  d3.select("g#__summary_svg_graph")
    .append("g")
    .attr("id", "__summary_svg_xAxisG")
    .attr("transform", `translate(0, ${(margin.top + margin.bottom) * 1.5})`)
    .call(xAxis);

  // y축 정보입니다
  yAxis = d3.svg
    .axis()
    .scale(yScale)
    .orient("left")
    .ticks(6) // tick 개수를 정의합니다
    .tickSize(width - (margin.left + margin.right) * 4.5); // 너비 길이를 정의합니다

  // y축을 추가하고 위치를 translate 시킵니다
  d3.select("g#__summary_svg_graph")
    .append("g")
    .attr("id", "__summary_svg_yAxisG")
    .attr(
      "transform",
      `translate(${width - (margin.left + margin.right)} , ${
        margin.bottom + margin.top
      })`
    )
    .call(yAxis);

  d3.select("g#__summary_svg_graph")
    .selectAll("rect")
    .data(data_array)
    .enter()
    .append("rect")
    .attr("class", "__summary_rect")
    .attr("width", (d) => (d / 1000000) * filter_bar[0]) // 막대 너비
    .attr("height", 15) // 막대 높이
    .style("fill", "rgb(99, 108, 241)")
    .style("opacity", 1)
    .attr("x", (d) => (margin.left + margin.right) * 3.5) // x 위치
    .attr(
      "y",
      (d, i) => i * margin.top * 2.17 + (margin.top + margin.bottom) * 1.8
    ) // y 위치
    // 마우스 over 시 tooltip이 보이고 out 시 사라집니다. 마우스 위치에 따라서 tooltip 위치가 바뀝니다.
    .on("mouseover", function () {
      tooltip.style("display", "block");
      d3.select(this).style("fill", "#f39820");
    })
    .on("mouseout", function () {
      tooltip.style("display", "none");
      d3.select(this).style("fill", "rgb(99, 108, 241)");
    })
    .on("mousemove", function (d) {
      tooltip.style("left", d3.event.pageX + 10 + "px");
      tooltip.style("top", d3.event.pageY - 10 + "px");
      tooltip.text(`${d}`);
    });

  // tooltip 의 속성을 설정합니다
  let tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "toolTip")
    .style("display", "none");

  // 그래프에서 표시되는 선들을 회색으로 변경합니다
  d3.selectAll("path.domain")
    .style("fill", "none")
    .style("stroke", "lightgray");

  d3.selectAll("line").style("stroke", "lightgray");

  // y축 제목을 추가하고 속성을 설정해줍니다
  d3.select("g#__summary_svg_graph")
    .append("text")
    .attr("id", "__yAxis_label")
    .attr("x", -height / 2)
    .attr("y", margin.left * 1.4)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("요일별 구분")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // 그래프의 타이틀에 대한 속성을 설정해줍니다
  d3.select("g#__summary_svg_graph")
    .append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", margin.top + margin.bottom)
    .attr("text-anchor", "middle")
    .text(`< 20년도 ${selected_gu} 요일별 총 유동인구 >`)
    .style("font-size", "1.3em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // x축 제목을 추가하고 속성을 설정해줍니다
  d3.select("g#__summary_svg_graph")
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - margin.top)
    .attr("text-anchor", "middle")
    .text("총 유동인구(백만명)")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .style("fill", "black");

  d3.selectAll(".moves_filter").on("click", (d, i) => {
    let moves_filter = document.getElementsByClassName("moves_filter");
    temp_filter = moves_filter[i].innerHTML;
    update_Bars(data[i], temp_filter);
  });

  function update_Bars(data, temp_filter) {
    /* y축의 최대값 설정을 위한 max_value를 알아내기 위해서 확진자 값만 data_array에 저장합니다 */
    let data_array = [];

    for (let i = 0; i < data[temp_filter].length; i++) {
      data_array.push(parseInt(data[temp_filter][i]));
    }
    let max_value = d3.max(data_array, (d) => d);

    width = document.getElementById("__summary").offsetWidth;
    height = document.getElementById("__summary").offsetHeight;
    margin = { top: 20, left: 20, bottom: 20, right: 20 };

    // domain에 실제 데이터 값을 넣고 range에 화면 픽셀 값을 넣습니다
    xScale = d3.scale
      .linear()
      .domain([0, max_value * 1.1])
      .range([
        (margin.left + margin.right) * 3.5,
        width - (margin.left + margin.right),
      ]); // y축 크기
    yScale = d3.scale
      .linear()
      .domain([1, data[temp_filter].length])
      .range([height - (margin.top + margin.bottom) * 3, margin.top * 2]); // x축 크기

    // x축 정보입니다
    xAxis = d3.svg
      .axis()
      .scale(xScale)
      .orient("bottom")
      .tickSize(height - (margin.top + margin.bottom) * 3) // 높이 길이를 정의합니다
      .ticks(5)
      .tickSubdivide(true);

    // x축을 추가하고 위치를 translate 시킵니다
    d3.select("g#__summary_svg_xAxisG").transition().duration(1500).call(xAxis);

    // y축 정보입니다
    yAxis = d3.svg
      .axis()
      .scale(yScale)
      .orient("left")
      .ticks(6) // tick 개수를 정의합니다
      .tickSize(width - (margin.left + margin.right) * 4.5); // 너비 길이를 정의합니다

    // y축을 추가하고 위치를 translate 시킵니다
    d3.select("g#__summary_svg_yAxisG").transition().duration(1500).call(yAxis);

    d3.select("g#__summary_svg_graph text#__yAxis_label").text(
      `${temp_filter} 구분`
    );

    d3.select("g#__summary_svg_graph text.title").text(
      `< 20년도 ${selected_gu} ${temp_filter} 총 유동인구 >`
    );

    let rects = document.getElementsByClassName("__summary_rect");
    if (temp_filter === "요일별") {
      d3.select("g#__summary_svg_graph")
        .selectAll("rect")
        .data(data_array)
        .transition()
        .duration(1500)
        .attr("width", (d) => (d / 1000000) * filter_bar[0]) // 막대 너비
        .style("opacity", 1)
        .style("display", "block")
        .attr(
          "y",
          (d, i) => i * margin.top * 2.17 + (margin.top + margin.bottom) * 1.8
        ); // y 위치
    } else if (temp_filter === "시간대별") {
      d3.select("g#__summary_svg_graph")
        .selectAll("rect")
        .data(data_array)
        .transition()
        .duration(1500)
        .attr("width", (d) => (d / 1000000) * filter_bar[1]) // 막대 너비
        .attr(
          "y",
          (d, i) =>
            i * (margin.top + margin.bottom) * 1.3 +
            (margin.top + margin.bottom) * 1.8
        ); // y 위치

      rects[6].style.opacity = "0";
      rects[6].style.display = "none";
    } else if (temp_filter === "연령대별") {
      d3.select("g#__summary_svg_graph")
        .selectAll("rect")
        .data(data_array)
        .transition()
        .duration(1500)
        .attr("width", (d) => (d / 1000000) * filter_bar[2]) // 막대 너비
        .attr(
          "y",
          (d, i) =>
            i * (margin.top + margin.bottom) * 1.3 +
            (margin.top + margin.bottom) * 1.8
        ); // y 위치

      rects[6].style.opacity = "0";
      rects[6].style.display = "none";
    }

    change_label2(temp_filter);
    update_axis_label2();
  }
  change_label2("요일별");
  update_axis_label2();
}

// 하단 첫번째 그래프의 데이터를 읽고 covid_graph() 함수에 전달합니다
d3.csv("covid19_quarter.csv", (error, data) => covid_graph(data));

// 반복문을 통해서 gu_covid에 각 행정구 정보를 배열에 저장합니다
function covid_graph(data) {
  for (let i = 0; i < gu_options.length; i++) {
    gu_covid[gu_options[i]] = []; // 행정구 정보를 저장할 배열을 선언합니다
    for (let j = 0; j < data.length; j++) {
      if (data[j].행정구 == gu_options[i]) {
        gu_covid[gu_options[i]].push(data[j]); // 데이터 object를 배열에 저장합니다
      }
    }
  }
}

// 전달한 데이터를 막대 그래프로 표시합니다
function read_gu_covid(data) {
  /* y축의 최대값 설정을 위한 max_value를 알아내기 위해서 확진자 값만 data_array에 저장합니다 */
  let data_array = [];

  for (let i = 0; i < data.length; i++) {
    data_array.push(parseInt(data[i].확진자));
  }
  let max_value = d3.max(data_array, (d) => d); // 확진자 최대값을 저장합니다. y축의 최대값으로 사용됩니다.

  // __first_svg 아래에 g 태그를 추가합니다
  d3.select("svg#__first_svg").append("g").attr("id", "__first_svg_graph");

  // svg 태그의 부모 태그의 너비와 높이를 구합니다
  // 상하좌우 margin 값을 정의합니다
  width = document.getElementById("__first").offsetWidth;
  height = document.getElementById("__first").offsetHeight;
  margin = { top: 20, left: 20, bottom: 20, right: 20 };

  // domain에 실제 데이터 값을 넣고 range에 화면 픽셀 값을 넣습니다
  xScale = d3.scale
    .linear()
    .domain([1, data.map((d) => d.기준년도_분기).length])
    .range([
      (margin.left + margin.right) * 3,
      width - (margin.left + margin.right) * 2,
    ]); // x축 크기
  yScale = d3.scale
    .linear()
    .domain([0, max_value * 1.1])
    .range([height - (margin.top + margin.bottom) * 2.5, margin.top]); // y축 크기

  // x축 정보입니다
  xAxis = d3.svg
    .axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(4) // tick 개수를 정의합니다
    .tickSize(height - (margin.top + margin.bottom) * 3) // 높이 길이를 정의합니다
    .tickSubdivide(true);

  // x축을 추가하고 위치를 translate 시킵니다
  d3.select("g#__first_svg_graph")
    .append("g")
    .attr("id", "__first_svg_xAxisG")
    .attr("transform", `translate(0, ${(margin.top + margin.bottom) * 1.5})`)
    .call(xAxis);

  // y축 정보입니다
  yAxis = d3.svg
    .axis()
    .scale(yScale)
    .orient("left")
    .ticks(6) // tick 개수를 정의합니다
    .tickSize(width - (margin.left + margin.right) * 3); // 너비 길이를 정의합니다

  // y축을 추가하고 위치를 translate 시킵니다
  d3.select("g#__first_svg_graph")
    .append("g")
    .attr("id", "__first_svg_yAxisG")
    .attr(
      "transform",
      `translate(${width - (margin.left + margin.right)} , ${
        margin.bottom + margin.top
      })`
    )
    .call(yAxis);

  // 확진자 수 데이터로 막대 그래프를 생성합니다
  d3.select("g#__first_svg_graph")
    .selectAll("rect")
    .data(data_array)
    .enter()
    .append("rect")
    .attr("width", 30) // 막대 너비
    .attr("height", 0) // 막대 높이
    .style("fill", "rgb(99, 108, 241)")
    .style("opacity", 1)
    .attr("x", (d, i) => i * margin.left * 3.7 + margin.left * 5.3) // x 위치
    .attr("y", height - (margin.top + margin.bottom) * 1.5) // y 위치
    // 마우스 over 시 tooltip이 보이고 out 시 사라집니다. 마우스 위치에 따라서 tooltip 위치가 바뀝니다.
    .on("mouseover", function () {
      tooltip.style("display", "block");
      d3.select(this).style("fill", "#f39820");
    })
    .on("mouseout", function () {
      tooltip.style("display", "none");
      d3.select(this).style("fill", "rgb(99, 108, 241)");
    })
    .on("mousemove", function (d) {
      tooltip.style("left", d3.event.pageX + 10 + "px");
      tooltip.style("top", d3.event.pageY - 10 + "px");
      tooltip.text(`${d}`);
    });

  d3.select("g#__first_svg_graph")
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("height", (d) => (d / 10) * bar_ratio[0]) // 막대 높이
    .attr(
      "y",
      (d) =>
        height - (margin.top + margin.bottom) * 1.5 - (d / 10) * bar_ratio[0]
    ) // y 위치
    .delay((d, i) => i * 100);

  // tooltip 의 속성을 설정합니다
  let tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "toolTip")
    .style("display", "none");

  // 그래프에서 표시되는 선들을 회색으로 변경합니다
  d3.selectAll("path.domain")
    .style("fill", "none")
    .style("stroke", "lightgray");

  d3.selectAll("line").style("stroke", "lightgray");

  // y축 제목을 추가하고 속성을 설정해줍니다
  d3.select("g#__first_svg_graph")
    .append("text")
    .attr("x", -height / 2)
    .attr("y", margin.left * 1.4)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("코로나 확진자(명)")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // 그래프의 타이틀에 대한 속성을 설정해줍니다
  d3.select("g#__first_svg_graph")
    .append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", margin.top + margin.bottom)
    .attr("text-anchor", "middle")
    .text(`< ${data[0].행정구} 연도별-분기별 확진자 수 >`)
    .style("font-size", "1.3em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // x축 제목을 추가하고 속성을 설정해줍니다
  d3.select("g#__first_svg_graph")
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - margin.top)
    .attr("text-anchor", "middle")
    .text("기준 연도_분기")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // x축에 표시되는 라벨을 설정합니다
  d3.select("g#__first_svg_xAxisG")
    .selectAll("text")
    .data(data)
    .text((d, i) => `${data[i].기준년도_분기}`);
}

// 하단 두번째 그래프의 데이터를 읽고 moves_graph() 함수에 전달합니다
d3.csv("total_moves.csv", (error, data) => moves_graph(data));

// 반복문을 통해서 gu_moves에 각 행정구 정보를 배열에 저장합니다
function moves_graph(data) {
  for (let i = 0; i < gu_options.length; i++) {
    gu_moves[gu_options[i]] = []; // 행정구 정보를 저장할 배열을 선언합니다
    for (let j = 0; j < data.length; j++) {
      if (data[j].행정구 == gu_options[i]) {
        gu_moves[gu_options[i]].push(data[j]); // 데이터 object를 배열에 저장합니다
      }
    }
  }
}

// 전달한 데이터를 막대 그래프로 표시합니다
function read_gu_moves(data) {
  /* y축의 최대값 설정을 위한 max_value를 알아내기 위해서 유동인구 값만 data_array에 저장합니다 */
  let data_array = [];
  for (let i = 0; i < data.length; i++) {
    data_array.push(parseInt(data[i].총유동인구수));
  }
  let max_value = d3.max(data_array, (d) => d); // 유동인구 최대값을 저장합니다. y축의 최대값으로 사용됩니다.

  // __second_svg 아래에 g 태그를 추가합니다
  d3.select("svg#__second_svg").append("g").attr("id", "__second_svg_graph");

  // svg 태그의 부모 태그의 너비와 높이를 구합니다
  // 상하좌우 margin 값을 정의합니다
  width = document.getElementById("__second").offsetWidth;
  height = document.getElementById("__second").offsetHeight;
  margin = { top: 20, left: 20, bottom: 20, right: 20 };

  // domain에 실제 데이터 값을 넣고 range에 화면 픽셀 값을 넣습니다
  xScale = d3.scale
    .linear()
    .domain([1, data.map((d) => d.기준년도_분기).length])
    .range([
      (margin.left + margin.right) * 3,
      width - (margin.left + margin.right) * 2,
    ]); // x축 크기
  yScale = d3.scale
    .linear()
    .domain([0, max_value * 1.1])
    .range([height - (margin.top + margin.bottom) * 2.5, margin.top]); // y축 크기

  // x축 정보입니다
  xAxis = d3.svg
    .axis()
    .scale(xScale)
    .orient("bottom")
    .tickSize(height - (margin.top + margin.bottom) * 3) // 높이 길이를 정의합니다
    .tickSubdivide(true);

  // x축을 추가하고 위치를 translate 시킵니다
  d3.select("g#__second_svg_graph")
    .append("g")
    .attr("id", "__second_svg_xAxisG")
    .attr("transform", `translate(0, ${(margin.top + margin.bottom) * 1.5})`)
    .call(xAxis);

  // y축 정보입니다
  yAxis = d3.svg
    .axis()
    .scale(yScale)
    .orient("left")
    .ticks(8) // tick 개수를 정의합니다
    .tickSize(width - (margin.left + margin.right) * 3); // 너비 길이를 정의합니다

  // y축을 추가하고 위치를 translate 시킵니다
  d3.select("g#__second_svg_graph")
    .append("g")
    .attr("id", "__second_svg_yAxisG")
    .attr(
      "transform",
      `translate(${width - (margin.left + margin.right)}, ${
        margin.bottom + margin.top
      })`
    )
    .call(yAxis);

  // 유동인구 데이터로 막대 그래프를 생성합니다
  d3.select("g#__second_svg_graph")
    .selectAll("rect")
    .data(data_array)
    .enter()
    .append("rect")
    .attr("width", 30) // 막대 너비
    .attr("height", 0) // 막대 높이
    .style("fill", "rgb(99, 108, 241)")
    .style("opacity", 1)
    .attr(
      "x",
      (d, i) =>
        i * (margin.left + margin.bottom) * 1.1 +
        (margin.left + margin.right) * 2.1
    ) // x 위치
    .attr("y", height - (margin.top + margin.bottom) * 2) // y 위치
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
    // 마우스 over 시 tooltip이 보이고 out 시 사라집니다. 마우스 위치에 따라서 tooltip 위치가 바뀝니다.
    .on("mouseover", function () {
      tooltip.style("display", "block");
      d3.select(this).style("fill", "#f39820");
    })
    .on("mouseout", function () {
      tooltip.style("display", "none");
      d3.select(this).style("fill", "rgb(99, 108, 241)");
    })
    .on("mousemove", function (d) {
      tooltip.style("left", d3.event.pageX + 10 + "px");
      tooltip.style("top", d3.event.pageY - 10 + "px");
      tooltip.text(`${d}`);
    });

  d3.select("g#__second_svg_graph")
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("height", (d) => (d / 10000) * bar_ratio[1]) // 막대 높이
    .attr(
      "y",
      (d) =>
        height - (margin.top + margin.bottom) * 2 - (d / 10000) * bar_ratio[1]
    ) // y 위치
    .delay((d, i) => i * 100);

  // tooltip 의 속성을 설정합니다
  let tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "toolTip")
    .style("display", "none");

  // 그래프에서 표시되는 선들을 회색으로 변경합니다
  d3.selectAll("path.domain")
    .style("fill", "none")
    .style("stroke", "lightgray");

  d3.selectAll("line").style("stroke", "lightgray");

  // y축 제목을 추가하고 속성을 설정해줍니다
  d3.select("g#__second_svg_graph")
    .append("text")
    .attr("x", -height / 2)
    .attr("y", margin.left * 1.4)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("총유동인구수(만명)")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // 그래프의 타이틀에 대한 속성을 설정해줍니다
  d3.select("g#__second_svg_graph")
    .append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", margin.left + margin.right)
    .attr("text-anchor", "middle")
    .text(`< ${data[0].행정구} 연도별-분기별 유동인구 >`)
    .style("font-size", "1.3em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // x축 제목을 추가하고 속성을 설정해줍니다
  d3.select("g#__second_svg_graph")
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - margin.top)
    .attr("text-anchor", "middle")
    .text("기준 연도_분기")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // x축에 표시되는 라벨을 설정합니다
  d3.select("g#__second_svg_xAxisG")
    .selectAll("text")
    .data(data)
    .attr("transform", "rotate(0)")
    .text((d, i) => `${data[i].기준년도_분기}`);

  // y축 tick 라벨링 데이터를 가져옵니다
  yLabels = document.querySelectorAll("g#__second_svg_yAxisG text");
  let new_yLabels = [];
  for (let i = 0; i < yLabels.length; i++) {
    new_yLabels.push(yLabels[i].innerHTML);
  }

  // y축 tick 라벨을 다시 설정합니다
  d3.select("g#__second_svg_yAxisG")
    .selectAll("text")
    .data(new_yLabels)
    .text((d, i) => parseInt(d) / 10);
}

// 하단 세번째 그래프의 데이터를 읽고 sales_graph() 함수에 전달합니다
d3.csv("total_sales.csv", (error, data) => sales_graph(data));

// 반복문을 통해서 gu_sales에 각 행정구 정보를 배열에 저장합니다
function sales_graph(data) {
  for (let i = 0; i < gu_options.length; i++) {
    gu_sales[gu_options[i]] = []; // 행정구 정보를 저장할 배열을 선언합니다
    for (let j = 0; j < data.length; j++) {
      if (data[j].행정구 == gu_options[i]) {
        gu_sales[gu_options[i]].push(data[j]); // 데이터 object를 배열에 저장합니다
      }
    }
  }
}

// 전달한 데이터를 막대 그래프로 표시합니다
function read_gu_sales(data) {
  /* y축의 최대값 설정을 위한 max_value를 알아내기 위해서 총매출 값만 data_array에 저장합니다 */
  let data_array = [];
  for (let i = 0; i < data.length; i++) {
    data_array.push(parseInt(data[i].총매출)); // 총매출 최대값을 저장합니다. y축의 최대값으로 사용됩니다.
  }
  let max_value = d3.max(data_array, (d) => d);

  // __third_svg 아래에 g 태그를 추가합니다
  d3.select("svg#__third_svg").append("g").attr("id", "__third_svg_graph");

  // svg 태그의 부모 태그의 너비와 높이를 구합니다
  // 상하좌우 margin 값을 정의합니다
  width = document.getElementById("__third").offsetWidth;
  height = document.getElementById("__third").offsetHeight;
  margin = { top: 20, left: 20, bottom: 20, right: 20 };

  // domain에 실제 데이터 값을 넣고 range에 화면 픽셀 값을 넣습니다
  xScale = d3.scale
    .linear()
    .domain([1, data.map((d) => d.기준년도_분기).length])
    .range([
      (margin.left + margin.right) * 3,
      width - (margin.left + margin.right) * 2,
    ]); // x축 크기
  yScale = d3.scale
    .linear()
    .domain([0, max_value * 1.1])
    .range([height - (margin.top + margin.bottom) * 2.5, margin.top]); // y축 크기

  // x축 정보입니다
  xAxis = d3.svg
    .axis()
    .scale(xScale)
    .orient("bottom")
    .tickSize(height - (margin.top + margin.bottom) * 3) // 높이 길이를 정의합니다
    .tickSubdivide(true);

  // x축을 추가하고 위치를 translate 시킵니다
  d3.select("g#__third_svg_graph")
    .append("g")
    .attr("id", "__third_svg_xAxisG")
    .attr("transform", `translate(0, ${(margin.top + margin.bottom) * 1.5})`)
    .call(xAxis);

  // y축 정보입니다
  yAxis = d3.svg
    .axis()
    .scale(yScale)
    .orient("left")
    .ticks(6) // tick 개수를 정의합니다
    .tickSize(width - (margin.left + margin.right) * 3); // 너비 길이를 정의합니다

  // y축을 추가하고 위치를 translate 시킵니다
  d3.select("g#__third_svg_graph")
    .append("g")
    .attr("id", "__third_svg_yAxisG")
    .attr(
      "transform",
      `translate(${width - (margin.left + margin.right)} , ${
        margin.bottom + margin.top
      })`
    )
    .call(yAxis);

  // 총매출 데이터로 막대 그래프를 생성합니다
  d3.select("g#__third_svg_graph")
    .selectAll("rect")
    .data(data_array)
    .enter()
    .append("rect")
    .attr("width", 30) // 막대 너비
    .attr("height", 0) // 막대 높이
    .style("fill", "rgb(99, 108, 241)")
    .style("opacity", 1)
    .attr(
      "x",
      (d, i) =>
        i * (margin.left + margin.bottom) * 1.1 +
        (margin.left + margin.right) * 2.1
    ) // x 위치
    .attr("y", height - (margin.top + margin.bottom) * 2) // y 위치
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
    // 마우스 over 시 tooltip이 보이고 out 시 사라집니다. 마우스 위치에 따라서 tooltip 위치가 바뀝니다.
    .on("mouseover", function () {
      tooltip.style("display", "block");
      d3.select(this).style("fill", "#f39820");
    })
    .on("mouseout", function () {
      tooltip.style("display", "none");
      d3.select(this).style("fill", "rgb(99, 108, 241)");
    })
    .on("mousemove", function (d) {
      tooltip.style("left", d3.event.pageX + 10 + "px");
      tooltip.style("top", d3.event.pageY - 10 + "px");
      tooltip.text(`${d}`);
    });

  d3.select("g#__third_svg_graph")
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("height", (d) => (d / 100000000000) * bar_ratio[2]) // 막대 높이
    .attr(
      "y",
      (d) =>
        height -
        (margin.top + margin.bottom) * 2 -
        (d / 100000000000) * bar_ratio[2]
    ) // y 위치
    .delay((d, i) => i * 100);

  // tooltip 의 속성을 설정합니다
  let tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "toolTip")
    .style("display", "none");

  // 그래프에서 표시되는 선들을 회색으로 변경합니다
  d3.selectAll("path.domain")
    .style("fill", "none")
    .style("stroke", "lightgray");

  d3.selectAll("line").style("stroke", "lightgray");

  // y축 제목을 추가하고 속성을 설정해줍니다
  d3.select("g#__third_svg_graph")
    .append("text")
    .attr("x", -height / 2)
    .attr("y", margin.left * 1.4)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("총매출(천억원)")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // 그래프의 타이틀에 대한 속성을 설정해줍니다
  d3.select("g#__third_svg_graph")
    .append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", margin.top + margin.bottom)
    .attr("text-anchor", "middle")
    .text(`< ${data[0].행정구} 연도별-분기별 총매출 >`)
    .style("font-size", "1.3em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // x축 제목을 추가하고 속성을 설정해줍니다
  d3.select("g#__third_svg_graph")
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - margin.top)
    .attr("text-anchor", "middle")
    .text("기준 연도_분기")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // x축에 표시되는 라벨을 설정합니다
  d3.select("g#__third_svg_xAxisG")
    .selectAll("text")
    .data(data)
    .text((d, i) => `${data[i].기준년도_분기}`);

  // y축 tick 라벨링 데이터를 가져옵니다
  yLabels = document.querySelectorAll("g#__third_svg_yAxisG text");
  let new_yLabels = [];
  for (let i = 0; i < yLabels.length; i++) {
    if (yLabels[i].innerHTML[1] === ",") {
      new_yLabels.push(yLabels[i].innerHTML[0] + yLabels[i].innerHTML[2]);
    } else {
      new_yLabels.push(yLabels[i].innerHTML.substr(0, 1));
    }
  }

  // y축 tick 라벨을 다시 설정합니다
  d3.select("g#__third_svg_yAxisG")
    .selectAll("text")
    .data(new_yLabels)
    .text((d, i) => d);
}

// 지도 페이지 우하단 그래프의 데이터를 읽고 seoul_graph() 함수에 전달합니다
d3.csv("up_jong2.csv", (error, data) => seoul_graph(data));

// 반복문을 통해서 gu_street에 각 행정구 별 상권 정보를 배열에 저장합니다
function seoul_graph(data) {
  for (let i = 0; i < gu_options.length; i++) {
    gu_street[gu_options[i]] = []; // 행정구 정보를 저장할 배열을 선언합니다
    for (let j = 0; j < data.length; j++) {
      if (data[j].행정구 == gu_options[i]) {
        gu_street[gu_options[i]].push(data[j]); // 데이터 object를 배열에 저장합니다
      }
    }
  }
}

function read_gu_street(data) {
  /* y축의 최대값 설정을 위한 max_value를 알아내기 위해서 매출 값만 data_array에 저장합니다 */
  let data_array = [];

  for (let i = 0; i < data.length; i++) {
    data_array.push(parseInt(data[i].순위1_매출));
  }
  let max_value = d3.max(data_array, (d) => d); // 매출 최대값을 저장합니다. y축의 최대값으로 사용됩니다.

  // __seoul_line_svg 아래에 g 태그를 추가합니다
  d3.select("svg#__seoul_line_svg")
    .append("g")
    .attr("id", "__seoul_line_svg_graph");

  // svg 태그의 부모 태그의 너비와 높이를 구합니다
  // 상하좌우 margin 값을 정의합니다
  width = document.getElementById("__seoul_line").offsetWidth;
  height = document.getElementById("__seoul_line").offsetHeight;
  margin = { top: 20, left: 20, bottom: 20, right: 20 };

  // domain에 실제 데이터 값을 넣고 range에 화면 픽셀 값을 넣습니다
  xScale = d3.scale
    .linear()
    .domain([0, data.length])
    .range([margin.left, width - (margin.left + margin.right) * 5]); // x축 크기
  yScale = d3.scale
    .linear()
    .domain([0, max_value * 1.1])
    .range([
      height - (margin.top + margin.bottom) * 2,
      (margin.top + margin.bottom) * 2,
    ]); // y축 크기

  // x축 정보입니다
  xAxis = d3.svg
    .axis()
    .scale(xScale)
    .orient("bottom")
    .tickSize(height - (margin.top + margin.bottom) * 4) // 높이 길이를 정의합니다
    .tickValues([1, 2, 3, 4]);

  // x축을 추가하고 위치를 translate 시킵니다
  d3.select("g#__seoul_line_svg_graph")
    .append("g")
    .attr("id", "__seoul_line_xAxisG")
    .attr(
      "transform",
      `translate(${margin.left}, ${(margin.top + margin.bottom) * 2})`
    )
    .call(xAxis);

  // y축 정보입니다
  yAxis = d3.svg
    .axis()
    .scale(yScale)
    .orient("right")
    .ticks(6) // tick 개수를 정의합니다
    .tickSize(width - (margin.left + margin.right) * 4) // 너비 길이를 정의합니다
    .tickSubdivide(true);

  // y축을 추가하고 위치를 translate 시킵니다
  d3.select("g#__seoul_line_svg_graph")
    .append("g")
    .attr("id", "__seoul_line_yAxisG")
    .attr("transform", `translate(${margin.left + margin.right}, 0)`)
    .call(yAxis);

  // 꺾은선에 대한 x,y 스케일들을 정의합니다
  first_business_Line_street = d3.svg
    .line()
    .x((d) => xScale(d.시간순) + margin.left)
    .y((d) => yScale(d.순위1_매출));

  second_business_Line_street = d3.svg
    .line()
    .x((d) => xScale(d.시간순) + margin.left)
    .y((d) => yScale(d.순위2_매출));

  third_business_Line_street = d3.svg
    .line()
    .x((d) => xScale(d.시간순) + margin.left)
    .y((d) => yScale(d.순위3_매출));

  // 꺾은선을 추가합니다
  d3.select("g#__seoul_line_svg_graph")
    .append("path")
    .attr("id", "first_line_street")
    .attr("d", first_business_Line_street(data))
    .attr("fill", "none")
    .attr("stroke", "rgb(252, 141, 98)")
    .attr("stroke-width", 5);

  d3.select("g#__seoul_line_svg_graph")
    .append("path")
    .attr("id", "second_line_street")
    .attr("d", second_business_Line_street(data))
    .attr("fill", "none")
    .attr("stroke", "rgb(141, 160, 203)")
    .attr("stroke-width", 5);

  d3.select("g#__seoul_line_svg_graph")
    .append("path")
    .attr("id", "third_line_street")
    .attr("d", third_business_Line_street(data))
    .attr("fill", "none")
    .attr("stroke", "rgb(102, 194, 165)")
    .attr("stroke-width", 5);

  // 매출 1순위 데이터를 추가합니다
  d3.select("g#__seoul_line_svg_graph")
    .selectAll("circle.__first_business_street")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "__first_business_street")
    .attr("r", 7) // 원의 크기
    .attr("cx", (d) => xScale(d.시간순) + margin.left) // x 위치
    .attr("cy", (d) => yScale(d.순위1_매출)) // y 위치
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .style("fill", "rgb(252, 141, 98)")
    // 마우스 over 시 tooltip이 보이고 out 시 사라집니다. 마우스 위치에 따라서 tooltip 위치가 바뀝니다.
    .on("mouseover", function () {
      tooltip.style("display", "block");
      d3.select(this).attr("stroke-width", 0).style("fill", "black");
    })
    .on("mouseout", function () {
      tooltip.style("display", "none");
      d3.select(this)
        .attr("stroke-width", 2)
        .style("fill", "rgb(252, 141, 98)");
    })
    .on("mousemove", function (d) {
      tooltip.style("left", d3.event.pageX + 10 + "px");
      tooltip.style("top", d3.event.pageY - 10 + "px");
      tooltip.text(`${d.순위1_매출}`);
    });

  // 매출 2순위 데이터를 추가합니다
  d3.select("g#__seoul_line_svg_graph")
    .selectAll("circle.__second_business_street")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "__second_business_street")
    .attr("r", 7) // 원의 크기
    .attr("cx", (d) => xScale(d.시간순) + margin.left) // x 위치
    .attr("cy", (d) => yScale(d.순위2_매출)) // y 위치
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .style("fill", "rgb(141, 160, 203)")
    // 마우스 over 시 tooltip이 보이고 out 시 사라집니다. 마우스 위치에 따라서 tooltip 위치가 바뀝니다.
    .on("mouseover", function () {
      tooltip.style("display", "block");
      d3.select(this).attr("stroke-width", 0).style("fill", "black");
    })
    .on("mouseout", function () {
      tooltip.style("display", "none");
      d3.select(this)
        .attr("stroke-width", 2)
        .style("fill", "rgb(141, 160, 203)");
    })
    .on("mousemove", function (d) {
      tooltip.style("left", d3.event.pageX + 10 + "px");
      tooltip.style("top", d3.event.pageY - 10 + "px");
      tooltip.text(`${d.순위2_매출}`);
    });

  // 매출 3순위 데이터를 추가합니다
  d3.select("g#__seoul_line_svg_graph")
    .selectAll("circle.__third_business_street")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "__third_business_street")
    .attr("r", 7) // 원의 크기
    .attr("cx", (d) => xScale(d.시간순) + margin.left) // x 위치
    .attr("cy", (d) => yScale(d.순위3_매출)) // y 위치
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .style("fill", "rgb(102, 194, 165)")
    // 마우스 over 시 tooltip이 보이고 out 시 사라집니다. 마우스 위치에 따라서 tooltip 위치가 바뀝니다.
    .on("mouseover", function () {
      tooltip.style("display", "block");
      d3.select(this).attr("stroke-width", 0).style("fill", "black");
    })
    .on("mouseout", function () {
      tooltip.style("display", "none");
      d3.select(this)
        .attr("stroke-width", 2)
        .style("fill", "rgb(102, 194, 165)");
    })
    .on("mousemove", function (d) {
      tooltip.style("left", d3.event.pageX + 10 + "px");
      tooltip.style("top", d3.event.pageY - 10 + "px");
      tooltip.text(`${d.순위3_매출}`);
    });

  // tooltip 의 속성을 설정합니다
  let tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "toolTip")
    .style("display", "none");

  let first_circle_pos = document.getElementsByClassName(
    "__first_business_street"
  )[3];
  let second_circle_pos = document.getElementsByClassName(
    "__second_business_street"
  )[3];
  let third_circle_pos = document.getElementsByClassName(
    "__third_business_street"
  )[3];

  d3.select("g#__seoul_line_svg_graph")
    .append("text")
    .attr("id", "__text_sales_first")
    .attr("x", first_circle_pos.cx.baseVal.value + 20)
    .attr("y", first_circle_pos.cy.baseVal.value)
    .style("fill", "rgb(252, 141, 98)")
    .text(data[0].순위1);

  d3.select("g#__seoul_line_svg_graph")
    .append("text")
    .attr("id", "__text_sales_second")
    .attr("x", second_circle_pos.cx.baseVal.value + 20)
    .attr("y", second_circle_pos.cy.baseVal.value)
    .style("fill", "rgb(141, 160, 203)")
    .text(data[0].순위2);

  d3.select("g#__seoul_line_svg_graph")
    .append("text")
    .attr("id", "__text_sales_third")
    .attr("x", third_circle_pos.cx.baseVal.value + 20)
    .attr("y", third_circle_pos.cy.baseVal.value)
    .style("fill", "rgb(102, 194, 165)")
    .text(data[0].순위3);

  // 그래프에서 표시되는 선들을 회색으로 변경합니다
  d3.selectAll("path.domain")
    .style("fill", "none")
    .style("stroke", "lightgray");

  d3.selectAll("line").style("stroke", "lightgray");

  // y축 제목을 추가하고 속성을 설정해줍니다
  d3.select("g#__seoul_line_svg_graph")
    .append("text")
    .attr("transform", "rotate(90)")
    .attr("x", height / 2)
    .attr("y", -(width - margin.right - margin.left))
    .attr("text-anchor", "middle")
    .text("총 매출액(억원)")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // 그래프의 타이틀에 대한 속성을 설정해줍니다
  d3.select("g#__seoul_line_svg_graph")
    .append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", margin.top + margin.bottom)
    .attr("text-anchor", "middle")
    .text(`< "${data[0].상권명}" 매출 상위 업종 3가지 >`)
    .style("font-size", "1.5em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // x축 제목을 추가하고 속성을 설정해줍니다
  d3.select("g#__seoul_line_svg_graph")
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - margin.top)
    .attr("text-anchor", "middle")
    .text("기준 연도_분기")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .style("fill", "black");

  // x축에 표시되는 라벨을 설정합니다
  d3.select("g#__seoul_line_xAxisG")
    .selectAll("text")
    .data(data)
    .text((d, i) => `${data[i].기준년도_분기}`);

  d3.select("div#__seoul_summary_txt")
    .data(data)
    .append("text")
    .attr("id", "__summary_level")
    .text(`${data[0].변화} (${data[0].종합평가}%)`);

  d3.select("div#__summary_moves_txt")
    .data(data)
    .append("text")
    .text(`${data[0].유동인구3}`);

  d3.select("div#__summary_sales_txt")
    .data(data)
    .append("text")
    .text(`${data[0].매출3}`);

  change_color(data[0].변화, data[0].유동인구3, data[0].매출3);

  d3.selectAll("div.__sample").on("click", (d, index) => {
    let temp_data = [];
    for (let i = 0; i < gu_street[selected_gu].length; i++) {
      if (samples[index].innerHTML === gu_street[selected_gu][i].상권명) {
        temp_data.push(gu_street[selected_gu][i]);
      }
    }
    d3.select(".__clicked")
      .style("background-color", "black")
      .style("color", "white");
    document
      .getElementsByClassName("__clicked")[0]
      .classList.remove("__clicked");
    samples[index].classList.add("__clicked");

    update_Line(temp_data);
  });

  function update_Line(data) {
    /* y축 정보를 재설정하기 위해서 max_value, xScale, yScale, yAxis 정보를 재설정해줍니다. */
    let data_array = [];

    for (let i = 0; i < data.length; i++) {
      data_array.push(parseInt(data[i].순위1_매출));
    }
    let max_value = d3.max(data_array, (d) => d);

    width = document.getElementById("__seoul_line").offsetWidth;
    height = document.getElementById("__seoul_line").offsetHeight;
    margin = { top: 20, left: 20, bottom: 20, right: 20 };

    xScale = d3.scale
      .linear()
      .domain([0, data.length])
      .range([margin.left, width - (margin.left + margin.right) * 5]); // x축 크기
    yScale = d3.scale
      .linear()
      .domain([0, max_value * 1.1])
      .range([
        height - (margin.top + margin.bottom) * 2,
        (margin.top + margin.bottom) * 2,
      ]); // y축 크기

    yAxis = d3.svg
      .axis()
      .scale(yScale)
      .orient("right")
      .ticks(6) // y축 개수
      .tickSize(width - (margin.left + margin.right) * 4) // x축 길이
      .tickSubdivide(true);

    d3.select("g#__seoul_line_yAxisG")
      .transition()
      .duration(1500) // transition 애니매이션의 재생시간을 추가합니다
      .call(yAxis);
    /* -------------- 재설정 끝 -------------- */

    // 그래프 타이틀을 변경해줍니다
    d3.select("g#__seoul_line_svg_graph > text.title").text(
      `< "${data[0].상권명}" 매출 상위 업종 3가지 >`
    );

    d3.select("input#__covid_default").property("checked", true);

    d3.select("#__seoul_summary_txt text").text(
      `${data[0].변화} (${data[0].종합평가}%)`
    );

    d3.select("#__summary_moves_txt text").text(`${data[0].유동인구3}`);

    d3.select("#__summary_sales_txt text").text(`${data[0].매출3}`);

    // 매출 1순위 원의 y 위치를 변경해줍니다
    d3.select("g#__seoul_line_svg_graph")
      .selectAll("circle.__first_business_street")
      .data(data)
      .attr("r", 7)
      .transition()
      .duration(1500)
      .attr("cy", (d) => yScale(d.순위1_매출));

    // 매출 2순위 원의 y 위치를 변경해줍니다
    d3.select("g#__seoul_line_svg_graph")
      .selectAll("circle.__second_business_street")
      .data(data)
      .attr("r", 7)
      .transition()
      .duration(1500)
      .attr("cy", (d) => yScale(d.순위2_매출));

    // 매출 3순위 원의 y 위치를 변경해줍니다
    d3.select("g#__seoul_line_svg_graph")
      .selectAll("circle.__third_business_street")
      .data(data)
      .attr("r", 7)
      .transition()
      .duration(1500)
      .attr("cy", (d) => yScale(d.순위3_매출));

    // 매출 1순위 path를 재설정해줍니다
    d3.select("path#first_line_street")
      .transition()
      .duration(1500)
      .attr("d", first_business_Line_street(data));

    // 매출 2순위 path를 재설정해줍니다
    d3.select("path#second_line_street")
      .transition()
      .duration(1500)
      .attr("d", second_business_Line_street(data));

    // 매출 3순위 path를 재설정해줍니다
    d3.select("path#third_line_street")
      .transition()
      .duration(1500)
      .attr("d", third_business_Line_street(data));

    change_label(data);
    change_color(data[0].변화, data[0].유동인구3, data[0].매출3);
    covid_select_event(data);
    update_axis_label();
    coloring_street(data[0].변화);
  }

  update_axis_label();
  covid_select_event(data);
}

function covid_select_event(data) {
  d3.selectAll("input.__covid_select").on("change", (d, i) => {
    let here_level, here_moves, here_sales;
    here_level = data[0].변화;
    if (i === 0) {
      here_moves = data[0].유동인구3;
      here_sales = data[0].매출3;
    } else if (i === 1) {
      here_moves = data[0].유동인구4;
      here_sales = data[0].매출4;
    } else {
      here_moves = data[0].유동인구5;
      here_sales = data[0].매출5;
    }

    d3.select("#__summary_moves_txt text").text(`${here_moves}`);

    d3.select("#__summary_sales_txt text").text(`${here_sales}`);

    change_color(here_level, here_moves, here_sales);
  });
}

function change_color(level, moves, sales) {
  if (level === "활성") {
    d3.select("#__summary_level").style("color", "#66c2a5");
  } else if (level === "유지") {
    d3.select("#__summary_level").style("color", "#f39820");
  } else {
    d3.select("#__summary_level").style("color", "red");
  }

  if (moves === "증가") {
    d3.select("#__summary_moves_txt text").style("color", "#66c2a5");
  } else {
    d3.select("#__summary_moves_txt text").style("color", "red");
  }

  if (sales === "증가") {
    d3.select("#__summary_sales_txt text").style("color", "#66c2a5");
  } else {
    d3.select("#__summary_sales_txt text").style("color", "red");
  }
}

function change_label(data) {
  d3.select("text#__text_sales_first")
    .data(data)
    .transition()
    .duration(1500)
    .attr("y", yScale(data[3].순위1_매출))
    .text(data[0].순위1);

  d3.select("text#__text_sales_second")
    .data(data)
    .transition()
    .duration(1500)
    .attr("y", yScale(data[3].순위2_매출))
    .text(data[0].순위2);

  d3.select("text#__text_sales_third")
    .data(data)
    .transition()
    .duration(1500)
    .attr("y", yScale(data[3].순위3_매출))
    .text(data[0].순위3);
}

function update_axis_label() {
  let yLabels = document.querySelectorAll("g#__seoul_line_yAxisG text");
  let new_yLabels = [];
  for (let i = 0; i < yLabels.length; i++) {
    if (yLabels[i].innerHTML[2] === ",") {
      new_yLabels.push(yLabels[i].innerHTML.substr(0, 2) + "0");
    } else if (yLabels[i].innerHTML[1] === ",") {
      new_yLabels.push(yLabels[i].innerHTML[0] + yLabels[i].innerHTML[2]);
    } else if (yLabels[i].innerHTML[3] === ",") {
      if (yLabels[i].innerHTML.length === 15) {
        new_yLabels.push(yLabels[i].innerHTML.substr(0, 3) + "0");
      } else {
        new_yLabels.push(yLabels[i].innerHTML.substr(0, 1));
      }
    } else {
      new_yLabels.push(yLabels[i].innerHTML);
    }
  }
  // y축 tick 라벨을 다시 설정합니다
  d3.select("g#__seoul_line_yAxisG")
    .selectAll("text")
    .data(new_yLabels)
    .text((d, i) => d);
}

function coloring_street(data) {
  if (data === "활성") {
    d3.select(".__clicked")
      .style("background-color", "rgb(102, 194, 165)")
      .style("color", "black");
  } else if (data === "유지") {
    d3.select(".__clicked")
      .style("background-color", "rgb(252, 141, 98)")
      .style("color", "black");
  } else if (data === "주의") {
    d3.select(".__clicked").style("background-color", "red");
  }
}

function change_label2(data) {
  let days = [
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
    "일요일",
  ];
  let times = [
    "00~06시",
    "06~11시",
    "11~14시",
    "14~17시",
    "17~21시",
    "21~24시",
  ];
  let ages = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];

  if (data === "요일별") {
    d3.selectAll("g#__summary_svg_yAxisG text")
      .data(days.reverse())
      .text((d) => d);
  } else if (data === "시간대별") {
    d3.selectAll("g#__summary_svg_yAxisG text")
      .data(times.reverse())
      .text((d) => d);
  } else if (data === "연령대별") {
    d3.selectAll("g#__summary_svg_yAxisG text")
      .data(ages.reverse())
      .text((d) => d);
  }
}

function update_axis_label2() {
  let xLabels = document.querySelectorAll("g#__summary_svg_xAxisG text");
  let new_xLabels = [];
  for (let i = 0; i < xLabels.length; i++) {
    if (xLabels[i].innerHTML[1] === ",") {
      new_xLabels.push(xLabels[i].innerHTML.substr(0, 1));
    } else if (xLabels[i].innerHTML[2] === ",") {
      new_xLabels.push(xLabels[i].innerHTML.substr(0, 2));
    } else if (xLabels[i].innerHTML[3] === ",") {
      new_xLabels.push(xLabels[i].innerHTML.substr(0, 3));
    } else {
      new_xLabels.push(xLabels[i].innerHTML);
    }
  }
  // x축 tick 라벨을 다시 설정합니다
  d3.select("g#__summary_svg_xAxisG")
    .selectAll("text")
    .data(new_xLabels)
    .text((d, i) => d);
}
