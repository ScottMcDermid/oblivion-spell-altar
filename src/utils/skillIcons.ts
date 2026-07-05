import type { IconType } from 'react-icons';
import {
  FaFeather,
  FaFireAlt,
  FaEye,
  FaBriefcaseMedical,
  FaDice,
  FaShieldAlt,
  FaUnlockAlt,
  FaVial,
} from 'react-icons/fa';
import {
  GiAnvil,
  GiBreastplate,
  GiChatBubble,
  GiDevilMask,
  GiDominoMask,
  GiFist,
  GiHood,
  GiLeatherArmor,
  GiLeg,
  GiRun,
  GiSpikedMace,
} from 'react-icons/gi';
import { LuSword } from 'react-icons/lu';
import { MdAttachMoney } from 'react-icons/md';
import { TbArcheryArrow } from 'react-icons/tb';

import type { School, Skill } from '@/utils/spellEffectUtils';

export const skillIcons: Record<Skill, IconType> = {
  Acrobatics: GiLeg,
  Alchemy: FaVial,
  Alteration: FaFeather,
  Armorer: GiAnvil,
  Athletics: GiRun,
  Blade: LuSword,
  Block: FaShieldAlt,
  Blunt: GiSpikedMace,
  Conjuration: GiDevilMask,
  Destruction: FaFireAlt,
  'Hand-to-Hand': GiFist,
  'Heavy Armor': GiBreastplate,
  Illusion: GiDominoMask,
  'Light Armor': GiLeatherArmor,
  Marksman: TbArcheryArrow,
  Mercantile: MdAttachMoney,
  Mysticism: FaEye,
  Restoration: FaBriefcaseMedical,
  Security: FaUnlockAlt,
  Sneak: GiHood,
  Speechcraft: GiChatBubble,
};

export const schoolIcons: Record<School, IconType> = {
  Alteration: FaFeather,
  Conjuration: GiDevilMask,
  Destruction: FaFireAlt,
  Illusion: GiDominoMask,
  Mysticism: FaEye,
  Restoration: FaBriefcaseMedical,
};

export const luckIcon: IconType = FaDice;
