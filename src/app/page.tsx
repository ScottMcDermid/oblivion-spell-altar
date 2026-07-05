'use client';

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, StyledEngineProvider } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import theme from '@/app/theme';

import SpellEffectSelector from '@/components/SpellEffectSelector';

import { useSpellStore } from '@/data/spellStore';
import ActiveSpellEffects from '@/components/ActiveSpellEffects';
import ActiveSpellSummary from '@/components/ActiveSpellSummary';
import CharacterSkillsDrawer from '@/components/CharacterSkillsDrawer';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function Home() {
  const {
    addedEffects,
    actions: { resetSpell },
  } = useSpellStore();
  const [isCharacterSkillsOpen, setIsCharacterSkillsOpen] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [expandedEffectId, setExpandedEffectId] = useState<string | null>(null);

  const handleReset = (confirm: boolean) => {
    if (confirm) {
      resetSpell();
      setExpandedEffectId(null);
    }
    setIsConfirmingReset(false);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <h1 className="absolute w-screen text-center text-lg">Oblivion Spell Altar</h1>
        <div className="max-w-screen m-auto flex h-screen max-h-screen max-w-6xl flex-col bg-inherit">
          {/* Title */}

          {/* Nav bar */}
          <div className="z-20 flex h-12 w-full flex-row justify-between px-2 pt-6 sm:pt-2">
            <div className="flex place-items-center">
              <Button
                variant="contained"
                aria-label="Adjust your skills"
                onClick={() => setIsCharacterSkillsOpen(true)}
              >
                <BookIcon />
                <div className="hidden sm:block">&nbsp;Skills</div>
              </Button>
              {addedEffects.length > 0 && (
                <Button
                  className="mx-2"
                  color="error"
                  aria-label="Reset Character"
                  onClick={() => setIsConfirmingReset(true)}
                >
                  <DeleteIcon />
                  <div className="hidden sm:block">&nbsp;Reset</div>
                </Button>
              )}
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col justify-center gap-6 overflow-y-auto bg-inherit pt-4 sm:flex-row">
            <div className="flex min-h-0 flex-1 flex-shrink-0 flex-col sm:max-w-80">
              <SpellEffectSelector
                onEffectAdded={(id) => setExpandedEffectId(id)}
              />
            </div>

            <div className="mt-3 max-h-80 flex-1 bg-inherit sm:max-h-full lg:max-w-full">
              <ActiveSpellEffects
                expandedEffectId={expandedEffectId}
                onToggleExpand={(id) =>
                  setExpandedEffectId((prev) => (prev === id ? null : id))
                }
              />
              <div className="mt-3">{addedEffects.length > 0 && <ActiveSpellSummary />}</div>
            </div>
          </div>
        </div>
        <footer className="relative mt-16 flex w-full flex-col border-t border-gray-700 bg-neutral-900 px-6 py-8 text-sm text-gray-400">
          <div className="mx-auto max-w-4xl space-y-2 text-center">
            <p>Oblivion Tool Suite © 2025 Scott McDermid</p>
            <p>
              Licensed under the{' '}
              <a
                href="https://www.gnu.org/licenses/gpl-3.0.html"
                className="underline hover:text-gray-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                GNU General Public License v3.0
              </a>
              .
            </p>
            <p>
              The Elder Scrolls and Oblivion are trademarks of Bethesda Softworks LLC, a ZeniMax
              Media company.
            </p>
            <p>This site is fan-made and not affiliated with Bethesda.</p>
          </div>
          <a
            href="https://github.com/ScottMcDermid/oblivion-spell-altar"
            className="mt-4 inline-flex items-center gap-2 self-end text-xs uppercase tracking-wide text-gray-400 transition hover:text-gray-200 sm:absolute sm:bottom-4 sm:right-6 sm:mt-0"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View the project on GitHub"
          >
            <GitHubIcon fontSize="small" />
            <span>GitHub</span>
          </a>
        </footer>

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
