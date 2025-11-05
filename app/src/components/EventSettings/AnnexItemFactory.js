 import { AnnexItem } from "./AnnexItem";
 import { PointsItem } from "./PointsItem";

export function AnnexItemFactory({ translator, data, onApply, onRemove}) {
    switch(data.type){
        case "points":
            return (<PointsItem translator={translator} data={data} onApply={onApply} onRemove={onRemove} />);
        default:
            return (<AnnexItem translator={translator} data={data} onApply={onApply} onRemove={onRemove} />);
    }
}