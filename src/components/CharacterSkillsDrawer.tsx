'use client';

import React, { useEffect, useState } from 'react';
import { Divider, Drawer, Slider } from '@mui/material';
import { schools } from '@/utils/spellEffectUtils';
import { useSpellStore } from '@/data/spellStore';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { schoolIcons, luckIcon as LuckIcon } from '@/utils/skillIcons';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export default function CharacterSkillsDrawer(props: { open: boolean; onClose: () => void }) {
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

  return (
    <Drawer anchor="right" open={props.open} onClose={props.onClose}>
      <div className="w-72 p-5">
        <h2 className="text-lg font-bold">Skills</h2>
        <Divider className="!my-3" />

        <div className="space-y-4">
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
        </div>

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
    </Drawer>
  );
}
