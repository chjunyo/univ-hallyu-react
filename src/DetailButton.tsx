import "./DetailButton.css";

function DataView({ data, onClick = () => {} }: { data: string; onClick?: () => void }) {
  return (
    <div className="detailButton" onClick={onClick}>
      <p>{data}</p>
    </div>
  );
}

export default DataView;
