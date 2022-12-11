export async function get({ pageNo, numOfRows, country }: { pageNo?: number; numOfRows?: number; country?: string } = {}) {
  if (!pageNo) pageNo = 1;
  if (!numOfRows) numOfRows = 10;
  if (!country) country = "US";
  const API_KEY: string = import.meta.env.VITE_API_KEY;
  const url = new URL("http://apis.data.go.kr/B260004/FieldKoreanwaveService2/getFieldKoreanwaveList2");
  url.searchParams.append("ServiceKey", API_KEY);
  url.searchParams.append("pageNo", pageNo.toString());
  url.searchParams.append("numOfRows", numOfRows.toString());
  url.searchParams.append("cond[country_iso_alp2::EQ]", country);
  url.searchParams.append("returnType", "JSON");
  try {
    const res: res = await (await fetch(url)).json();
    return res;
  } catch {
    throw new Error();
  }
}

export interface res {
  currentCouont: number;
  data: data[];
  numOfRows: number;
  pageNo: number;
  resultCode: number;
  resultMsg: string;
  totalCount: number;
}

export interface data {
  country_eng_nm: string;
  country_iso_alp2: string;
  country_nm: string;
  field: string;
  koreanwave_cn: string;
  written_year: number;
}
