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
        <div className="flex h-screen flex-col place-items-center overflow-y-auto bg-inherit">
          <h1 className="absolute items-center text-lg">Oblivion Spell Altar</h1>
          <div className="min-w-md flex w-full flex-row justify-between pl-2 pt-6 sm:pt-2">
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

          <div className="pt-4">
            <SpellEffectSelector
              onEffectSelect={(effect) => {
                setSelectedEffect(effect);
                setIsAddSpellEffectOpen(true);
              }}
            />

            <ActiveSpellEffects />
            {addedEffects.length > 0 && <ActiveSpellSummary />}
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
