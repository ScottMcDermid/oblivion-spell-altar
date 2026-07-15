'use client';

import React, { useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Box, Button, IconButton, InputAdornment, Snackbar, StyledEngineProvider, TextField, Toolbar, Typography } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ShareIcon from '@mui/icons-material/Share';

import theme from '@/app/theme';

import SpellEffectSelector from '@/components/SpellEffectSelector';
import ActiveSpellEffects, { EffectsSkeleton } from '@/components/ActiveSpellEffects';
import ActiveSpellSummary from '@/components/ActiveSpellSummary';
import CharacterSkillsDrawer from '@/components/CharacterSkillsDrawer';
import ConfirmDialog from '@/components/ConfirmDialog';

import { useSpellStore } from '@/data/spellStore';
import { useHydrated } from '@/hooks/useHydrated';
import { useShareSpell } from '@/hooks/useShareSpell';
import { type SpellData } from '@/utils/spellCodec';
import {
  applySkillMultiplier,
  getGoldCost,
  getMasteryFromMagickaCost,
  getMinLevelForMastery,
  spellEffectDefinitionById,
  type School,
  type SpellEffect,
} from '@/utils/spellEffectUtils';
import { cn } from '@/utils/cn';
import { schoolIcons, luckIcon as LuckIcon } from '@/utils/skillIcons';

function SharedSpellSummary({ sharedSpell }: { sharedSpell: SpellData }) {
  const { skills, luck, effects } = sharedSpell;

  const maxEffect = useMemo(
    () =>
      effects.reduce<SpellEffect | undefined>(
        (max, effect) =>
          !max || Math.floor(effect.magickaCost) > Math.floor(max.magickaCost) ? effect : max,
        undefined,
      ),
    [effects],
  );

  const school: School | null = useMemo(
    () => (maxEffect ? spellEffectDefinitionById[maxEffect.id].school : null),
    [maxEffect],
  );

  const mastery = useMemo(
    () => (maxEffect ? getMasteryFromMagickaCost(maxEffect.magickaCost) : null),
    [maxEffect],
  );

  const magickaCost = useMemo(
    () =>
      effects.reduce(
        (total, effect) =>
          total +
          applySkillMultiplier(
            effect.magickaCost,
            skills[spellEffectDefinitionById[effect.id].school],
            luck,
          ),
        0,
      ),
    [effects, skills, luck],
  );

  const minLevel = useMemo(
    () => (mastery ? getMinLevelForMastery(mastery) : 0),
    [mastery],
  );

  const goldCost = useMemo(() => getGoldCost(magickaCost), [magickaCost]);

  const relevantSchools = useMemo(
    () => Array.from(new Set(effects.map((e) => spellEffectDefinitionById[e.id].school))),
    [effects],
  );

  if (effects.length === 0) return null;

  return (
    <div className="w-full p-2 shadow-sm">
      {/* Relevant skills */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
        {relevantSchools.map((s) => {
          const Icon = schoolIcons[s];
          return (
            <div key={s} className="flex items-center gap-1.5">
              <Icon className="text-base" />
              <span>
                {s}: {skills[s]}
              </span>
            </div>
          );
        })}
        <div className="flex items-center gap-1.5">
          <LuckIcon className="text-base" />
          <span>Luck: {luck}</span>
        </div>
      </div>

      {school && mastery && (
        <div
          className={cn(
            'mt-4 flex items-center justify-end gap-4 text-lg',
            minLevel > skills[school] && 'text-error',
          )}
        >
          {school} {mastery}
        </div>
      )}
      {school && minLevel > 0 && (
        <div
          className={cn(
            'flex items-center justify-end gap-4',
            minLevel > skills[school] && 'text-error',
          )}
        >
          Level {minLevel}
        </div>
      )}
      <div className="mt-4 flex justify-end gap-4 text-lg">
        <div className="mt-4 flex items-center gap-4 text-lg">
          <div className="flex items-center gap-1">
            <span>{Intl.NumberFormat().format(magickaCost)} Magicka</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{Intl.NumberFormat().format(goldCost)} Gold</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const MAX_SPELL_NAME_LENGTH = 64;

export default function SpellAltar({ sharedSpell }: { sharedSpell?: SpellData }) {
  const {
    addedEffects,
    spellName,
    actions: { resetSpell, loadSpell, setSpellName },
  } = useSpellStore();
  const { copyShareUrl } = useShareSpell();
  const hydrated = useHydrated();

  const isViewOnly = !!sharedSpell;

  const [isCharacterSkillsOpen, setIsCharacterSkillsOpen] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [expandedEffectId, setExpandedEffectId] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const handleReset = (confirm: boolean) => {
    if (confirm) {
      resetSpell();
      setExpandedEffectId(null);
    }
    setIsConfirmingReset(false);
  };

  const handleShare = async () => {
    const success = await copyShareUrl();
    setSnackbarMessage(success ? 'Link copied to clipboard!' : 'Failed to copy link');
  };

  const handleCopyToMyAltar = () => {
    if (!sharedSpell) return;
    loadSpell({
      addedEffects: sharedSpell.effects,
      skills: sharedSpell.skills,
      luck: sharedSpell.luck,
      spellName: sharedSpell.name,
    });
    setSnackbarMessage('Spell copied to your altar!');
    window.location.href = '/';
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {/* Shared spell banner */}
        {isViewOnly && (
          <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-2 bg-yellow-900/80 px-4 py-2 text-sm text-yellow-200">
            <span>
              {sharedSpell?.name
                ? <>Viewing: <strong>{sharedSpell.name}</strong></>
                : 'Viewing a shared spell'}
            </span>
            <div className="flex gap-2">
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={handleCopyToMyAltar}
                className="text-xs normal-case"
              >
                Copy to my altar
              </Button>
              <Button
                size="small"
                variant="outlined"
                href="/"
                className="border-yellow-200/50 text-xs normal-case text-yellow-200"
              >
                Back to my altar
              </Button>
            </div>
          </div>
        )}

        <AppBar position="static" sx={{ backgroundColor: 'background.paper' }} elevation={1}>
          <Toolbar variant="dense" sx={{ gap: 1, overflow: 'hidden' }}>
            <IconButton
              component="a"
              href="https://oblivion.tools"
              size="small"
              aria-label="Oblivion Tools home"
              sx={{ p: 0.5 }}
            >
              <img src="/oblivion-tools-icon.ico" alt="Oblivion Tools" width={16} height={16} style={{ display: 'block' }} />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'secondary.main' }}
            >
              Oblivion Spell Altar
            </Typography>

            <Box sx={{ flex: 1 }} />

            {!isViewOnly && (
              <>
                {addedEffects.length > 0 && (
                  <>
                    <Button
                      size="small"
                      aria-label="Share Spell"
                      onClick={handleShare}
                      sx={{ minWidth: 0, px: { xs: '6px', sm: undefined } }}
                    >
                      <ShareIcon fontSize="small" />
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 0.5 }}>Share</Box>
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      aria-label="Reset Spell"
                      onClick={() => setIsConfirmingReset(true)}
                      sx={{ minWidth: 0, px: { xs: '6px', sm: undefined } }}
                    >
                      <RestartAltIcon fontSize="small" />
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 0.5 }}>Reset</Box>
                    </Button>
                  </>
                )}
                <Button
                  variant="contained"
                  size="small"
                  aria-label="Adjust your skills"
                  onClick={() => setIsCharacterSkillsOpen((prev) => !prev)}
                  sx={{ minWidth: 0, px: { xs: '6px', sm: undefined } }}
                >
                  <BookIcon fontSize="small" />
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 0.5 }}>Skills</Box>
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Box sx={{ display: 'flex', height: { xs: 'auto', sm: 'calc(100vh - 48px)' }, overflow: { xs: 'visible', sm: 'hidden' } }}>
          {/* Main content area */}
          <div className="flex min-w-0 flex-1 flex-col bg-inherit transition-all duration-[225ms] ease-[cubic-bezier(0.4,0,0.2,1)]">
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col sm:overflow-hidden bg-inherit">
              <div className="flex w-full flex-1 flex-col gap-6 bg-inherit pt-4 px-4 sm:flex-row sm:overflow-y-auto">
                {/* Spell effect selector (hidden in view-only mode) */}
                {!isViewOnly && (
                  <div className="flex max-h-80 overflow-y-auto flex-shrink-0 flex-col sm:sticky sm:top-0 sm:overflow-visible sm:max-h-full sm:max-w-80">
                    <SpellEffectSelector
                      onEffectAdded={(id) => setExpandedEffectId(id)}
                    />
                  </div>
                )}

                <div className={cn(
                  'mt-3 flex-1 bg-inherit lg:max-w-full',
                  isViewOnly && 'mx-auto max-w-4xl',
                )}>
                  {isViewOnly ? (
                    <>
                      {sharedSpell?.name && (
                        <h2 className="mb-4 text-2xl font-semibold text-gray-100">
                          {sharedSpell.name}
                        </h2>
                      )}
                      <ActiveSpellEffects
                        expandedEffectId={null}
                        onToggleExpand={() => {}}
                        viewOnlyEffects={sharedSpell.effects}
                        viewOnlySkills={sharedSpell.skills}
                        viewOnlyLuck={sharedSpell.luck}
                      />
                      <div className="mt-3">
                        <SharedSpellSummary sharedSpell={sharedSpell} />
                      </div>
                    </>
                  ) : (
                    <>
                      {!hydrated && <EffectsSkeleton />}
                      <div className={cn(
                        'transition-opacity duration-200',
                        hydrated ? 'opacity-100' : 'h-0 overflow-hidden opacity-0',
                      )}>
                        <div className="mb-4">
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Unnamed Spell"
                            label="Spell Name"
                            value={spellName}
                            onChange={(e) => setSpellName(e.target.value.slice(0, MAX_SPELL_NAME_LENGTH))}
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <span className="text-xs text-gray-500">
                                      {spellName.length}/{MAX_SPELL_NAME_LENGTH}
                                    </span>
                                  </InputAdornment>
                                ),
                              },
                            }}
                          />
                        </div>
                        <ActiveSpellEffects
                          expandedEffectId={expandedEffectId}
                          onToggleExpand={(id) =>
                            setExpandedEffectId((prev) => (prev === id ? null : id))
                          }
                        />
                        <div className="mt-3">
                          {addedEffects.length > 0 && <ActiveSpellSummary />}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Skills drawer — persistent right drawer on xl+, Dialog on smaller screens */}
          {!isViewOnly && (
            <CharacterSkillsDrawer
              open={isCharacterSkillsOpen}
              onClose={() => setIsCharacterSkillsOpen(false)}
            />
          )}
        </Box>

        <footer className="mt-16 w-full border-t border-gray-700 bg-neutral-900 px-6 py-8 text-sm text-gray-400">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 text-center sm:text-left">
            <div className="space-y-2">
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
            <div className="flex w-full justify-end">
              <a
                href="https://github.com/ScottMcDermid/oblivion-spell-altar"
                className="inline-flex items-center gap-2 rounded-md border border-transparent px-3 py-1 text-xs font-medium text-gray-400 transition hover:border-gray-600 hover:text-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current" focusable="false">
                  <path d="M12 .297C5.375.297 0 5.67 0 12.297c0 5.302 3.438 9.799 8.205 11.387.6.112.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.746.083-.73.083-.73 1.203.085 1.836 1.236 1.836 1.236 1.07 1.835 2.808 1.305 3.492.998.108-.775.418-1.305.762-1.606-2.665-.303-5.467-1.334-5.467-5.934 0-1.31.469-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.47 11.47 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.628-5.48 5.923.43.37.823 1.096.823 2.21 0 1.595-.015 2.882-.015 3.274 0 .32.22.694.825.576C20.565 22.092 24 17.597 24 12.297 24 5.67 18.627.297 12 .297z" />
                </svg>
                <span className="uppercase tracking-wide">GitHub</span>
              </a>
            </div>
          </div>
        </footer>

        {!isViewOnly && (
          <ConfirmDialog
            open={isConfirmingReset}
            description="This will delete all spell effects"
            handleClose={handleReset}
          />
        )}

        <Snackbar
          open={snackbarMessage !== null}
          autoHideDuration={3000}
          onClose={() => setSnackbarMessage(null)}
          message={snackbarMessage}
        />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
