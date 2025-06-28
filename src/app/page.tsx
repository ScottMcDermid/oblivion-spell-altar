'use client';

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, StyledEngineProvider } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import DeleteIcon from '@mui/icons-material/Delete';
import theme from '@/app/theme';

import SpellEffectSelector from '@/components/SpellEffectSelector';
import AddSpellEffectDialog from '@/components/AddSpellEffectDialog';
import { type SpellEffectDefinition } from '@/utils/spellEffectUtils';

import { useSpellStore } from '@/data/spellStore';
import ActiveSpellEffects from '@/components/ActiveSpellEffects';
import ActiveSpellSummary from '@/components/ActiveSpellSummary';
import CharacterSkillsDrawer from '@/components/CharacterSkillsDrawer';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function Home() {
  const {
    addedEffects,
    actions: { addSpellEffect, resetSpell },
  } = useSpellStore();
  const [isAddSpellEffectOpen, setIsAddSpellEffectOpen] = useState(false);
  const [isCharacterSkillsOpen, setIsCharacterSkillsOpen] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<SpellEffectDefinition | null>(null);

  const handleReset = (confirm: boolean) => {
    if (confirm) {
      resetSpell();
    }
    setIsConfirmingReset(false);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="max-w-screen m-auto flex h-screen max-h-screen max-w-6xl flex-col">
          {/* Title */}
          <h1 className="absolute w-full items-center text-center text-lg">Oblivion Spell Altar</h1>

          {/* Nav bar */}
          <div className="flex h-12 w-full flex-row justify-between px-2 pt-6 sm:pt-2">
            <div className="flex place-items-center">
              <Button
                variant="contained"
                aria-label="Adjust your skills"
                onClick={() => {
                  setIsCharacterSkillsOpen(true);
                }}
              >
                <BookIcon />
                <div className="hidden sm:block">&nbsp;Skills</div>
              </Button>
              {addedEffects.length > 0 && (
                <Button
                  className="mx-2"
                  color="error"
                  aria-label="Reset Character"
                  onClick={() => {
                    setIsConfirmingReset(true);
                  }}
                >
                  <DeleteIcon />
                  <div className="hidden sm:block">&nbsp;Reset</div>
                </Button>
              )}
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col justify-center gap-6 overflow-y-auto pt-4 sm:flex-row">
            <div className="flex min-h-0 flex-1 flex-shrink-0 flex-col sm:max-w-80">
              <SpellEffectSelector
                onEffectSelect={(effect) => {
                  setSelectedEffect(effect);
                  setIsAddSpellEffectOpen(true);
                }}
              />
            </div>

            <div className="mt-3 flex-1 lg:max-w-full">
              <ActiveSpellEffects />
              {addedEffects.length > 0 && <ActiveSpellSummary />}
            </div>
          </div>
        </div>

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

        <ConfirmDialog
          open={isConfirmingReset}
          description="This will delete all spell effects"
          handleClose={handleReset}
        />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
