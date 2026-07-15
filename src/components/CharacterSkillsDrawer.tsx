'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Slider,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { schools } from '@/utils/spellEffectUtils';
import { useSpellStore } from '@/data/spellStore';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { schoolIcons, luckIcon as LuckIcon } from '@/utils/skillIcons';

const DRAWER_WIDTH = 280;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function SkillsContent({
  localSkills,
  setLocalSkills,
  localLuck,
  setLocalLuck,
  debouncedSetSkill,
  debouncedSetLuck,
}: {
  localSkills: Record<string, number>;
  setLocalSkills: (skills: Record<string, number>) => void;
  localLuck: number;
  setLocalLuck: (luck: number) => void;
  debouncedSetSkill: (school: string, val: number) => void;
  debouncedSetLuck: (val: number) => void;
}) {
  return (
    <div className="space-y-4 p-4">
      {schools.map((school) => {
        const Icon = schoolIcons[school];
        const id = `skill-${school}`;
        return (
          <div key={school}>
            <div className="mb-1 flex items-center gap-2 text-sm">
              <Icon className="shrink-0 text-base text-gray-400" />
              <label htmlFor={id} className="flex-1 font-medium">{school}</label>
              <input
                id={id}
                type="number"
                value={localSkills[school]}
                onChange={(e) => {
                  const raw = parseInt(e.target.value, 10);
                  if (isNaN(raw)) return;
                  const val = clamp(raw, 1, 100);
                  setLocalSkills({ ...localSkills, [school]: val });
                  debouncedSetSkill(school, val);
                }}
                onBlur={(e) => {
                  const raw = parseInt(e.target.value, 10);
                  const val = clamp(isNaN(raw) ? 1 : raw, 1, 100);
                  setLocalSkills({ ...localSkills, [school]: val });
                  debouncedSetSkill(school, val);
                }}
                min={1}
                max={100}
                className="w-14 rounded border border-[#2e2e2e] bg-transparent px-2 py-0.5 text-right text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <Slider
              size="small"
              value={localSkills[school]}
              onChange={(_, val) => {
                setLocalSkills({ ...localSkills, [school]: val as number });
                debouncedSetSkill(school, val as number);
              }}
              min={1}
              max={100}
            />
          </div>
        );
      })}

      <Divider className="!my-4" />

      <div>
        <div className="mb-1 flex items-center gap-2 text-sm">
          <LuckIcon className="shrink-0 text-base text-gray-400" />
          <label htmlFor="skill-luck" className="flex-1 font-medium">Luck</label>
          <input
            id="skill-luck"
            type="number"
            value={localLuck}
            onChange={(e) => {
              const raw = parseInt(e.target.value, 10);
              if (isNaN(raw)) return;
              const val = clamp(raw, 1, 100);
              setLocalLuck(val);
              debouncedSetLuck(val);
            }}
            onBlur={(e) => {
              const raw = parseInt(e.target.value, 10);
              const val = clamp(isNaN(raw) ? 1 : raw, 1, 100);
              setLocalLuck(val);
              debouncedSetLuck(val);
            }}
            min={1}
            max={100}
            className="w-14 rounded border border-[#2e2e2e] bg-transparent px-2 py-0.5 text-right text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
        <Slider
          size="small"
          value={localLuck}
          onChange={(_, val) => {
            setLocalLuck(val as number);
            debouncedSetLuck(val as number);
          }}
          min={1}
          max={100}
        />
      </div>
    </div>
  );
}

export default function CharacterSkillsDrawer(props: { open: boolean; onClose: () => void }) {
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  const {
    luck,
    skills,
    actions: { setSkills, setLuck },
  } = useSpellStore();

  const [localSkills, setLocalSkills] = useState(skills);
  const [localLuck, setLocalLuck] = useState(luck);

  const debouncedSetSkill = useDebouncedCallback<[string, number]>(
    (school: string, val: number) => {
      setSkills({ [school]: val });
    },
    150,
  );

  const debouncedSetLuck = useDebouncedCallback<[number]>((val: number) => {
    setLuck(val);
  }, 150);

  useEffect(() => {
    setLocalSkills(skills);
  }, [skills]);

  useEffect(() => {
    setLocalLuck(luck);
  }, [luck]);

  const sharedProps = {
    localSkills,
    setLocalSkills,
    localLuck,
    setLocalLuck,
    debouncedSetSkill,
    debouncedSetLuck,
  };

  if (isDesktop) {
    return (
      <Drawer
        variant="persistent"
        anchor="right"
        open={props.open}
        sx={{
          width: props.open ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          transition: 'width 225ms cubic-bezier(0.4, 0, 0.2, 1)',
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            position: 'relative',
            height: '100%',
            border: 'none',
            borderLeft: '1px solid #2e2e2e',
            backgroundColor: 'inherit',
            overflowX: 'hidden',
            overflowY: 'auto',
          },
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-base font-semibold">Skills</h2>
          <IconButton aria-label="close" onClick={props.onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
        <SkillsContent {...sharedProps} />
      </Drawer>
    );
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      PaperProps={{
        className: 'w-[90vw] max-w-sm sm:max-w-md',
      }}
    >
      <IconButton
        aria-label="close"
        onClick={props.onClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle>Skills</DialogTitle>
      <DialogContent className="!p-0">
        <SkillsContent {...sharedProps} />
      </DialogContent>
    </Dialog>
  );
}
