'use client';

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, StyledEngineProvider } from '@mui/material';
import Book from '@mui/icons-material/Book';
import theme from '@/app/theme';

import SpellEffectSelector from '@/components/SpellEffectSelector';
import AddSpellEffectDialog from '@/components/AddSpellEffectDialog';
import { type SpellEffectDefinition } from '@/utils/spellEffectUtils';

import { useSpellStore } from '@/data/spellStore';
import ActiveSpellEffects from '@/components/ActiveSpellEffects';
import ActiveSpellSummary from '@/components/ActiveSpellSummary';
import CharacterSkillsDrawer from '@/components/CharacterSkillsDrawer';

export default function Home() {
  const {
    actions: { addSpellEffect },
  } = useSpellStore();
  const [isAddSpellEffectOpen, setIsAddSpellEffectOpen] = useState(false);
  const [isCharacterSkillsOpen, setIsCharacterSkillsOpen] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<SpellEffectDefinition | null>(null);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="flex h-screen flex-col place-items-center overflow-y-auto bg-inherit">
          <h1 className="absolute items-center text-lg">Oblivion Spell Altar</h1>
          <div className="flex w-full max-w-md flex-row justify-between pl-2 pt-6 sm:pt-2">
            <Button
              variant="contained"
              aria-label="Adjust your skills"
              onClick={() => {
                setIsCharacterSkillsOpen(true);
              }}
            >
              <Book />
              <div className="hidden sm:block">&nbsp;Skills</div>
            </Button>
          </div>

          <div className="pt-4">
            <SpellEffectSelector
              onEffectSelect={(effect) => {
                setSelectedEffect(effect);
                setIsAddSpellEffectOpen(true);
              }}
            />

            <ActiveSpellEffects />
            <ActiveSpellSummary />

            {selectedEffect && (
              <AddSpellEffectDialog
                effect={selectedEffect}
                open={isAddSpellEffectOpen}
                onClose={() => setIsAddSpellEffectOpen(false)}
                onSpellEffectConfirmed={(effect) => {
                  addSpellEffect(effect);
                  setIsAddSpellEffectOpen(false);
                }}
              />
            )}

            <CharacterSkillsDrawer
              open={isCharacterSkillsOpen}
              onClose={() => setIsCharacterSkillsOpen(false)}
            />
          </div>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
