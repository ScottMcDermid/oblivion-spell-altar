'use client';

import React, { useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
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
} from '@/utils/spellEffectUtils';

import ToggleButtons from '@/components/ToggleButtons';

export default function SpellEffectDialog(props: {
  effect: SpellEffectDefinition;
  skill: number;
  open: boolean;
  onClose: () => void;
  onSpellEffectConfirmed: (effect: SpellEffect) => void;
}) {
  const [range, setRange] = useState<SpellEffectRange>('Touch');
  const [magnitude, setMagnitude] = useState(MIN_MAGNITUDE);
  const [area, setArea] = useState(MIN_AREA);
  const [duration, setDuration] = useState(MIN_DURATION);

  const magickaCost = useMemo(
    () =>
      getMagickaCost({
        baseCost: props.effect.baseCost,
        range,
        magnitude,
        area,
        duration,
        skill: props.skill,
      }),
    [props.effect.baseCost, range, magnitude, area, duration, props.skill],
  );

  const goldCost = useMemo(() => getGoldCost(magickaCost), [magickaCost]);

  return (
    <Dialog
      className="min-w-64"
      onClose={() => props.onClose()}
      open={props.open}
      keepMounted={false}
      TransitionProps={{
        onExited: () => props.onClose,
      }}
    >
      <IconButton
        aria-label="close"
        onClick={props.onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent className="p-3">
        <div className="my-2 text-3xl">{props.effect.name}</div>

        <div className="space-y-6 p-4">
          <ToggleButtons
            name="Range"
            value={range}
            options={['Touch', 'Target', 'Self']}
            onChangeHandler={(range) => setRange(range as SpellEffectRange)}
          />
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
        </div>
        <div className="mt-4 flex items-center gap-4 text-lg">
          <Tooltip title="Magicka Cost">
            <div className="flex items-center gap-1">
              <FlashOn fontSize="small" />
              <span>{Intl.NumberFormat().format(magickaCost)}</span>
            </div>
          </Tooltip>

          <Tooltip title="Gold/Barter Cost">
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
          onClick={() =>
            props.onSpellEffectConfirmed({
              id: props.effect.id,
              range,
              magnitude,
              area,
              duration,
              magickaCost,
              goldCost,
            })
          }
        >
          Confirm Effect
        </Button>
      </DialogActions>
    </Dialog>
  );
}
