 import { AnnexItem }   from "./AnnexItem/AnnexItem";
 import { FilterItem }  from "./FilterItem/FilterItem";
 import { PointsItem }  from "./PointsItem/PointsItem";
 import { StageItem }   from './StageItem/StageItem';
 import { TeamItem }    from './TeamItem/TeamItem';

export function AnnexItemFactory({  type, translator, data, onApply, onRemove}) {
    switch(type){
        case "filter":
            return (<FilterItem translator={translator} data={data} onApply={onApply} onRemove={onRemove} />);
        case "points":
            return (<PointsItem translator={translator} data={data} onApply={onApply} onRemove={onRemove} />);
        case "stage":
            return (<StageItem translator={translator} data={data} onApply={onApply} onRemove={onRemove} />);
        case "team":
            return (<TeamItem translator={translator} data={data} onApply={onApply} onRemove={onRemove} />);
        default:
            return (<AnnexItem translator={translator} data={data} onApply={onApply} onRemove={onRemove} />);
    }
}