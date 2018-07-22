import { lighten, darken, desaturate } from 'polished';

// prettier-ignore
const theme = {
      azColor: '#cc615b',
      azExtColor: '#3d7fcc',
      dipDirectionColor: '#82b23e',
      dipColor: '#ccc470',
      bgColor: '#282828',
      fgColor: '#ffffff',
      planeColor: '#bcaa89',
      get azColorDe20() { return desaturate(0.2, this.azColor); },
      get azExtColorDe20() { return desaturate(0.2, this.azExtColor); },
      get dipDirectionColorDe20() { return desaturate(0.2, this.dipDirectionColor); },
      get dipColorDe20() { return desaturate(0.2, this.dipColor); },
      get bgColorD2() { return darken(0.02, this.bgColor); },
      get bgColorL2() { return lighten(0.02, this.bgColor); },
      get bgColorL5() { return lighten(0.05, this.bgColor); },
      get bgColorL10() { return lighten(0.1, this.bgColor); },
      get bgColorL20() { return lighten(0.2, this.bgColor); },
      get bgColorL30() { return lighten(0.3, this.bgColor); },
      get bgColorL40() { return lighten(0.4, this.bgColor); },
      get bgColorL50() { return lighten(0.5, this.bgColor); },
      get bgColorL60() { return lighten(0.6, this.bgColor); },
      get bgColorL70() { return lighten(0.7, this.bgColor); },
      get bgColorL80() { return lighten(0.8, this.bgColor); },
      get fgColorD5() { return darken(0.05, this.fgColor); },
      get fgColorD10() { return darken(0.1, this.fgColor); },
      get fgColorD20() { return darken(0.2, this.fgColor); },
      get fgColorD30() { return darken(0.3, this.fgColor); },
      get fgColorD40() { return darken(0.4, this.fgColor); },
      get fgColorD50() { return darken(0.5, this.fgColor); },
      get fgColorD60() { return darken(0.6, this.fgColor); },
      get fgColorD70() { return darken(0.7, this.fgColor); },
      get fgColorD80() { return darken(0.8, this.fgColor); },
    };

export default theme;
