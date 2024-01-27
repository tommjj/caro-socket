import {
    FaRegFaceKissWinkHeart,
    FaRegFaceTired,
    FaRegFaceSmileBeam,
    FaRegFaceSurprise,
    FaRegFaceSadCry,
    FaRegFaceGrinTongue,
    FaRegFaceGrinSquintTears,
    FaRegFaceAngry,
    FaRegFaceDizzy,
    FaRegFaceFlushed,
    FaRegFaceFrown,
    FaRegFaceGrimace,
    FaRegFaceGrin,
    FaRegFaceKissBeam,
    FaRegFaceGrinBeamSweat,
    FaRegFaceGrinHearts,
    FaRegFaceMeh,
    FaRegFaceMehBlank,
    FaRegFaceLaughWink,
    FaRegFaceLaughBeam,
} from 'react-icons/fa6';
import { TfiFaceSmile } from 'react-icons/tfi';

export const IconList = {
    TfiFaceSmile,
    LaughBeam: FaRegFaceLaughBeam,
    LaughWink: FaRegFaceLaughWink,
    MehBlank: FaRegFaceMehBlank,
    Meh: FaRegFaceMeh,
    Angry: FaRegFaceAngry,
    Dizzy: FaRegFaceDizzy,
    Flushed: FaRegFaceFlushed,
    Frown: FaRegFaceFrown,
    Grimace: FaRegFaceGrimace,
    Grin: FaRegFaceGrin,
    GrinBeamSweat: FaRegFaceGrinBeamSweat,
    GrinHearts: FaRegFaceGrinHearts,
    KissBeam: FaRegFaceKissBeam,
    GrinSquintTears: FaRegFaceGrinSquintTears,
    GrinTongue: FaRegFaceGrinTongue,
    FaceSadCry: FaRegFaceSadCry,
    Surprise: FaRegFaceSurprise,
    SmileBeam: FaRegFaceSmileBeam,
    FaceTired: FaRegFaceTired,
    KissWinkHeart: FaRegFaceKissWinkHeart,
};

export type IconType = keyof typeof IconList;

const Icon = ({ iconType }: { iconType: IconType }) => {
    const SelectedIcon = IconList[iconType];
    return (
        <>
            <SelectedIcon></SelectedIcon>
        </>
    );
};

export default Icon;
