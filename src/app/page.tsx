'use client';

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Slider, StyledEngineProvider } from '@mui/material';
import theme from '@/app/theme';

import SpellEffectSelector from '@/components/SpellEffectSelector';
import AddSpellEffectDialog from '@/components/AddSpellEffectDialog';
import { type SpellEffectDefinition } from '@/utils/spellEffectUtils';

import { useSpellStore } from '@/data/spellStore';
import ActiveSpellEffects from '@/components/ActiveSpellEffects';
import ActiveSpellSummary from '@/components/ActiveSpellSummary';

export default function Home() {
  const {
    actions: { addSpellEffect },
  } = useSpellStore();
  const [isAddSpellEffectOpen, setIsAddSpellEffectOpen] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<SpellEffectDefinition | null>(null);
  const [skill, setSkill] = useState(100);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="flex h-screen flex-col place-items-center overflow-y-auto bg-inherit">
          <h1 className="absolute items-center text-lg">Oblivion Spell Altar</h1>
          <div className="pt-4">
            <SpellEffectSelector
              onEffectSelect={(effect) => {
                setSelectedEffect(effect);
                setIsAddSpellEffectOpen(true);
              }}
            />

            <ActiveSpellEffects />
            <ActiveSpellSummary skill={skill} />

            <div className="w-full max-w-md p-8 shadow-sm">
              <div className="mb-1 flex justify-between">
                <label>Skill Level</label>
                <span>{skill}</span>
              </div>
              <Slider
                value={skill}
                aria-label="Magnitude"
                onChange={(_, val) => setSkill(val as number)}
                min={1}
                max={100}
              />
            </div>

            {selectedEffect && (
              <AddSpellEffectDialog
                effect={selectedEffect}
                skill={skill}
                open={isAddSpellEffectOpen}
                onClose={() => setIsAddSpellEffectOpen(false)}
                onSpellEffectConfirmed={(effect) => {
                  addSpellEffect(effect);
                  setIsAddSpellEffectOpen(false);
                }}
              />
            )}
          </div>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
