'use client';

import React from 'react';
import { Drawer, Slider } from '@mui/material';

import { schools } from '@/utils/spellEffectUtils';
import { useSpellStore } from '@/data/spellStore';

export default function CharacterSkillsDrawer(props: { open: boolean; onClose: () => void }) {
  const {
    luck,
    skills,
    actions: { setSkills, setLuck },
  } = useSpellStore();

  return (
    <Drawer anchor="left" open={props.open} onClose={props.onClose}>
      <div className="w-64 space-y-6 p-4">
        <h2 className="mb-4 text-lg font-bold">Skills</h2>

        {schools.map((school) => (
          <div key={school}>
            <div className="mb-1 flex justify-between text-sm">
              <label>{school}</label>
              <span>{skills[school]}</span>
            </div>
            <Slider
              value={skills[school]}
              onChange={(_, val) => setSkills({ [school]: val as number })}
              min={1}
              max={100}
            />
          </div>
        ))}
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <label>Luck</label>
            <span>{luck}</span>
          </div>
          <Slider value={luck} onChange={(_, val) => setLuck(val as number)} min={1} max={100} />
        </div>
      </div>
    </Drawer>
  );
}
