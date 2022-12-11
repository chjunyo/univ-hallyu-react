import { useEffect, useState } from "react";
import { get, data } from "./api";
import "./App.css";
import countries from "i18n-iso-countries";
import ko from "i18n-iso-countries/langs/ko.json";
import { XMarkIcon } from "@heroicons/react/24/outline";
import DetailButton from "./DetailButton";

function App() {
  const [page, setPage] = useState(1);
  const [list, setList] = useState<data[]>([]);
  const [selected, setSelected] = useState<data | undefined>(undefined);
  const [isEnded, setIsEnded] = useState(false);
  const [country, setCountry] = useState("");
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    // 최초 접속시 i18n-iso-countries 라이브러리 설정
    // countryList와 country 설정
    countries.registerLocale(ko);
    const tmp = Object.entries(countries.getNames("ko", { select: "official" }));
    setCountryList(tmp as any);
    setCountry(tmp[0][0]);
  }, []);

  useEffect(() => {
    // country 변경시 API호출후 list 변수에 할당
    // 만약 API 결과가 10개 이하인 경우 더 이상 page가 없다는 뜻이므로 isEnded를 true 설정, 10인 경우 page가 있을 수 있으므로 isEnded를 false 설정
    if (country !== "") {
      get({ pageNo: page, country }).then((res) => {
        setList(res.data);
        if (res.data.length < 10) {
          setIsEnded(true);
        } else if (res.data.length === 10) {
          setIsEnded(false);
        }
      });
    }
  }, [country]);

  useEffect(() => {
    // page 변경시 API 호출후 기존 list 변수 뒤 추가
    // 만약 API 결과가 10개 이하인 경우 더 이상 page가 없다는 뜻이므로 isEnded를 true 설정, 10인 경우 page가 있을 수 있으므로 isEnded를 false 설정
    if (country !== "" && page > 1) {
      get({ pageNo: page, country }).then((res) => {
        setList([...list, ...res.data]);
        if (res.data.length < 10) {
          setIsEnded(true);
        } else if (res.data.length === 10) {
          setIsEnded(false);
        }
      });
    }
  }, [page]);

  useEffect(() => {
    // Modal이 활성화될 경우 body 스크롤 비활성화
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selected]);

  return (
    <div className="main">
      <footer>
        2022-2 웹프로그래밍 과제 - 202103411 채준영 <a href="/License.html">License</a>
      </footer>
      <select onChange={(e) => setCountry(e.target.value)}>
        {countryList.map((country) => (
          <option value={country[0]}>{country[1]}</option>
        ))}
      </select>
      <div>
        {list.length === 0 ? <DetailButton data="존재하지 않습니다." /> : <></>}
        {list.map((data) => (
          <DetailButton data={data.field} onClick={() => setSelected(data)} />
        ))}
        {!isEnded ? <DetailButton data="더보기" onClick={() => setPage(page + 1)} /> : <></>}
      </div>
      {selected ? ( // Modal
        <div className="modal">
          <div>
            <h1>
              {selected.field}
              <span>{` ${selected.country_nm}`}</span>
            </h1>
            <div>
              <p>{selected.koreanwave_cn}</p>
            </div>
            <p>{selected.written_year}</p>
            <button onClick={() => setSelected(undefined)}>
              <XMarkIcon className="icon" />
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
