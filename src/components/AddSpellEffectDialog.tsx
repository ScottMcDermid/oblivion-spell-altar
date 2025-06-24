'use client';

import React, { useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FlashOn from '@mui/icons-material/FlashOn';
import AttachMoney from '@mui/icons-material/AttachMoney';

import {
  getMagickaCost,
  getGoldCost,
  MAX_AREA,
  MAX_DURATION,
  MAX_MAGNITUDE,
  MIN_AREA,
  MIN_DURATION,
  MIN_MAGNITUDE,
  type SpellEffect,
  type SpellEffectDefinition,
  type SpellEffectRange,
  applySkillMultiplier,
  spellEffectDefinitionById,
  attributes,
  skills as selectableSkills,
  Attribute,
  Skill,
  lockLevels,
  LockLevel,
} from '@/utils/spellEffectUtils';

import ToggleButtons from '@/components/ToggleButtons';
import { useSpellStore } from '@/data/spellStore';

export default function SpellEffectDialog(props: {
  effect: SpellEffectDefinition;
  open: boolean;
  onClose: () => void;
  onSpellEffectConfirmed: (effect: SpellEffect) => void;
}) {
  const [range, setRange] = useState<SpellEffectRange>(props.effect.availableRanges[0]);
  const [magnitude, setMagnitude] = useState(
    props.effect.availableParameters.includes('Magnitude') ? MIN_MAGNITUDE : 1,
  );
  const [area, setArea] = useState(MIN_AREA);
  const [duration, setDuration] = useState(MIN_DURATION);
  const [attribute, setAttribute] = useState(attributes[0]);
  const [skill, setSkill] = useState(selectableSkills[0]);
  const [lockLevel, setLockLevel] = useState(lockLevels[0]);

  const { skills, luck } = useSpellStore();

  const baseMagickaCost = useMemo(
    () =>
      getMagickaCost({
        baseCost: props.effect.baseCost,
        magnitude: props.effect.availableParameters.includes('Magnitude') ? magnitude : 0,
        area: props.effect.availableParameters.includes('Area') ? area : 0,
        duration: props.effect.availableParameters.includes('Duration') ? duration : 0,
        duration,
      }),
    [props.effect.baseCost, range, magnitude, area, duration],
  );

  const magickaCost = useMemo(
    () =>
      applySkillMultiplier(
        baseMagickaCost,
        skills[spellEffectDefinitionById[props.effect.id].school],
        luck,
      ),
    [baseMagickaCost, skills, luck],
  );

  const goldCost = useMemo(() => getGoldCost(magickaCost), [magickaCost]);

  return (
    <Dialog
      onClose={() => {
        setMagnitude(MIN_MAGNITUDE);
        setArea(MIN_AREA);
        setDuration(MIN_DURATION);
        setRange('Touch');
        props.onClose();
      }}
      open={props.open}
      keepMounted={false}
      TransitionProps={{
        onExited: () => props.onClose,
      }}
    >
      <IconButton
        aria-label="close"
        onClick={() => {
          setMagnitude(MIN_MAGNITUDE);
          setArea(MIN_AREA);
          setDuration(MIN_DURATION);
          setRange('Touch');
          props.onClose();
        }}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent className="min-w-80 p-3">
        <div className="my-2 pr-8 text-3xl">{props.effect.name}</div>

        <div className="space-y-6 p-4">
          {props.effect.selectableAttribute && (
            <FormControl className="w-full">
              <InputLabel id="attribute-select-label">Attribute</InputLabel>
              <Select
                labelId="attribute-select-label"
                value={attribute}
                label="Attribute"
                onChange={(e) => setAttribute(e.target.value as Attribute)}
              >
                {attributes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {props.effect.selectableSkill && (
            <FormControl className="w-full">
              <InputLabel id="skill-select-label">Skill</InputLabel>
              <Select
                labelId="skill-select-label"
                value={skill}
                label="Skill"
                onChange={(e) => setSkill(e.target.value as Skill)}
              >
                {selectableSkills.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {props.effect.selectableLockLevel && (
            <FormControl className="w-full">
              <InputLabel id="lock-level-select-label">LockLevel</InputLabel>
              <Select
                labelId="lock-level-select-label"
                value={lockLevel}
                label="LockLevel"
                onChange={(e) => setLockLevel(e.target.value as LockLevel)}
              >
                {lockLevels.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {props.effect.availableRanges.length > 1 && (
            <ToggleButtons
              name="Range"
              value={range}
              options={props.effect.availableRanges}
              onChangeHandler={(range) => setRange(range as SpellEffectRange)}
            />
          )}

          {props.effect.availableParameters.includes('Magnitude') && (
            <div>
              <div className="mb-1 flex justify-between">
                <label>Magnitude</label>
                <span>{magnitude} pts</span>
              </div>
              <Slider
                value={magnitude}
                aria-label="Magnitude"
                onChange={(_, val) => setMagnitude(val as number)}
                min={MIN_MAGNITUDE}
                max={MAX_MAGNITUDE}
              />
            </div>
          )}
          {props.effect.availableParameters.includes('Area') && (
            <div>
              <div className="mb-1 flex justify-between">
                <label>Area</label>
                <span>{area} ft</span>
              </div>
              <Slider
                value={area}
                aria-label="Area"
                onChange={(_, val) => setArea(val as number)}
                min={MIN_AREA}
                max={MAX_AREA}
              />
            </div>
          )}
          {props.effect.availableParameters.includes('Duration') && (
            <div>
              <div className="mb-1 flex justify-between">
                <label>Duration</label>
                <span>{duration}s</span>
              </div>

              <Slider
                value={duration}
                aria-label="Duration"
                onChange={(_, val) => setDuration(val as number)}
                min={MIN_DURATION}
                max={MAX_DURATION}
              />
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-4 text-lg">
          <Tooltip title="Magicka Cost">
            <div className="flex items-center gap-1">
              <FlashOn fontSize="small" />
              <span>{Intl.NumberFormat().format(magickaCost)}</span>
            </div>
          </Tooltip>

          <Tooltip title="Gold Cost">
            <div className="flex items-center gap-1">
              <AttachMoney fontSize="small" />
              <span>{Intl.NumberFormat().format(goldCost)}</span>
            </div>
          </Tooltip>
        </div>
      </DialogContent>
      <DialogActions className="space-between flex">
        <Button
          variant="contained"
          onClick={() => {
            setMagnitude(MIN_MAGNITUDE);
            setArea(MIN_AREA);
            setDuration(MIN_DURATION);
            setRange('Touch');
            setAttribute(attributes[0]);
            setSkill(selectableSkills[0]);
            setLockLevel(lockLevels[0]);
            props.onSpellEffectConfirmed({
              id: props.effect.id,
              range,
              magnitude: props.effect.availableParameters.includes('Magnitude') ? magnitude : 0,
              area: props.effect.availableParameters.includes('Area') ? area : 0,
              duration: props.effect.availableParameters.includes('Duration') ? duration : 0,
              magickaCost: baseMagickaCost,
              goldCost,
              ...(props.effect.selectableAttribute && { attribute }),
              ...(props.effect.selectableSkill && { skill }),
              ...(props.effect.selectableLockLevel && { lockLevel }),
            });
          }}
        >
          Add Spell Effect
        </Button>
      </DialogActions>
    </Dialog>
  );
}
