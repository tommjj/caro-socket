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
} from 'react-icons/fa6';

export const icon = {
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

export type IconList = keyof typeof icon;

const Icon = ({ iconType }: { iconType: IconList }) => {
    const SelectedIcon = icon[iconType];
    return (
        <>
            <SelectedIcon></SelectedIcon>
        </>
    );
};

export default Icon;
