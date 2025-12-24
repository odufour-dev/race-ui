 import { AnnexItem }   from "./AnnexItem/AnnexItem";
 import { FilterItem }  from "./FilterItem/FilterItem";
 import { PointsItem }  from "./PointsItem/PointsItem";
 import { StageItem }   from './StageItem/StageItem';
 import { TeamItem }    from './TeamItem/TeamItem';

export function AnnexItemFactory({  type, helper, data, onApply, onRemove}) {
    switch(type){
        case "filter":
            return (<FilterItem helper={helper} data={data} onApply={onApply} onRemove={onRemove} />);
        case "points":
            return (<PointsItem helper={helper} data={data} onApply={onApply} onRemove={onRemove} />);
        case "stage":
            return (<StageItem helper={helper} data={data} onApply={onApply} onRemove={onRemove} />);
        case "team":
            return (<TeamItem helper={helper} data={data} onApply={onApply} onRemove={onRemove} />);
        default:
            return (<AnnexItem helper={helper} data={data} onApply={onApply} onRemove={onRemove} />);
    }
}