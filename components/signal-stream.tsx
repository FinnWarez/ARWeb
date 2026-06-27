"use client";

import {
  CheckCircle2,
  Loader2,
  Play,
  RefreshCw,
  RotateCw,
  ShieldAlert,
  Smartphone,
  Sparkles,
  SquareTerminal,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AccountActions } from "@/components/account-actions";
import {
  GeneratedTextAdventureSession,
  SignalCard,
  SignalStreamState,
} from "@/lib/signals";

type SignalStreamResponse = {
  ok?: boolean;
  stream?: SignalStreamState;
  message?: string;
};

type GenerationResponse = {
  ok?: boolean;
  request?: {
    generationRequestId: string;
    status: string;
  } | null;
  message?: string;
};

type SessionResponse = {
  ok?: boolean;
  session?: GeneratedTextAdventureSession | null;
  message?: string;
};

export function SignalStream() {
  const [stream, setStream] = useState<SignalStreamState | null>(null);
  const [activeCard, setActiveCard] = useState<SignalCard | null>(null);
  const [activeSession, setActiveSession] = useState<GeneratedTextAdventureSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [needsAccount, setNeedsAccount] = useState(false);

  const loadStream = useCallback(async (options: { quiet?: boolean } = {}) => {
    if (!options.quiet) {
      setLoading(true);
      setMessage(null);
    }
    try {
      const response = await fetch("/api/signals", {
        method: "GET",
        cache: "no-store",
      });
      const body = (await response.json()) as SignalStreamResponse;
      if (!response.ok || !body.stream) {
        setStream(null);
        setNeedsAccount(response.status === 401);
        setMessage(body.message ?? "The Signal Stream relay did not return state.");
        return;
      }
      setStream(body.stream);
      setNeedsAccount(false);
      return body.stream;
    } catch {
      setMessage("The Signal Stream relay failed to answer.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const requestSignal = useCallback(async (options: { quiet?: boolean } = {}) => {
    setGenerating(true);
    if (!options.quiet) setMessage(null);
    try {
      const response = await fetch("/api/signals/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      });
      const body = (await response.json()) as GenerationResponse;
      if (!response.ok || !body.request?.generationRequestId) {
        setMessage(body.message ?? "A new Signal could not be requested.");
        return;
      }
      if (body.request.status === "QUEUED" || body.request.status === "GENERATING") {
        await pollGeneration(body.request.generationRequestId);
      }
      const refreshed = await loadStream({ quiet: true });
      if (!refreshed?.cards.length) {
        setMessage("No active Signal was returned yet. The backend may still be generating or approval may have failed.");
      }
    } catch {
      setMessage("A new Signal could not be requested.");
    } finally {
      setGenerating(false);
    }
  }, [loadStream]);

  const refreshStream = useCallback(async (options: { quiet?: boolean; topUpIfEmpty?: boolean } = {}) => {
    const loaded = await loadStream(options);
    if (options.topUpIfEmpty && loaded?.cards.length === 0) {
      await requestSignal({ quiet: true });
    }
    return loaded;
  }, [loadStream, requestSignal]);

  async function startMission(card: SignalCard) {
    if (!card.playableOnWeb) return;
    setActiveCard(card);
    setAdvancing(true);
    setMessage(null);
    try {
      const response = await fetch("/api/signals/text-adventure/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ generatedMissionInstanceId: card.generatedMissionInstanceId }),
      });
      const body = (await response.json()) as SessionResponse;
      if (!response.ok || !body.session) {
        setMessage(body.message ?? "The Mission session could not be opened.");
        setActiveCard(null);
        return;
      }
      setActiveSession(body.session);
      if (body.session.status === "GENERATING") {
        const updated = await pollSession(body.session.sessionId);
        if (updated) setActiveSession(updated);
        if (updated?.status === "COMPLETED") await refreshStream({ quiet: true });
      }
    } catch {
      setMessage("The Mission session could not be opened.");
      setActiveCard(null);
    } finally {
      setAdvancing(false);
    }
  }

  async function advanceMission(choiceId: string) {
    if (!activeSession?.currentStep) return;
    setAdvancing(true);
    setMessage(null);
    try {
      const response = await fetch("/api/signals/text-adventure/advance", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSession.sessionId,
          stepId: activeSession.currentStep.stepId,
          choiceId,
          clientRequestId: clientRequestId(),
        }),
      });
      const body = (await response.json()) as SessionResponse;
      if (!response.ok || !body.session) {
        setMessage(body.message ?? "The Mission choice could not be applied.");
        return;
      }
      setActiveSession(body.session);
      if (body.session.status === "GENERATING") {
        const updated = await pollSession(body.session.sessionId);
        if (updated) setActiveSession(updated);
        if (updated?.status === "COMPLETED") await refreshStream({ quiet: true });
      }
      if (body.session.status === "COMPLETED") {
        await refreshStream({ quiet: true });
      }
    } catch {
      setMessage("The Mission choice could not be applied.");
    } finally {
      setAdvancing(false);
    }
  }

  async function closeCompletion() {
    setActiveSession(null);
    setActiveCard(null);
    await refreshStream({ quiet: true });
  }

  useEffect(() => {
    void refreshStream({ topUpIfEmpty: true });
  }, [refreshStream]);

  const progression = stream?.progression;
  const account = stream?.account;
  const cards = stream?.cards ?? [];

  if (needsAccount) {
    return (
      <div className="space-y-6">
        <div className="border border-signal-gold/40 bg-signal-gold/10 p-5 text-signal-fog">
          <p>{message}</p>
        </div>
        <AccountActions />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-3 md:grid-cols-4">
        <StatTile label="Level" value={progression ? String(progression.level) : "-"} />
        <StatTile label="XP" value={progression ? progression.xp.toLocaleString() : "-"} />
        <StatTile label="Missions" value={progression ? String(progression.completedMissionCount) : "-"} />
        <StatTile label="Credits" value={account ? account.wallet.balance.toLocaleString() : "-"} />
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-signal-red">Signal Stream</p>
          <h2 className="mt-2 font-display text-4xl text-white">Active Signals</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => refreshStream({ topUpIfEmpty: true })}
            disabled={loading || generating || advancing}
            className="inline-flex items-center gap-2 border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/45 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Refresh
          </button>
          <button
            type="button"
            onClick={() => requestSignal()}
            disabled={loading || generating || advancing}
            className="inline-flex items-center gap-2 bg-white/92 px-4 py-3 text-sm font-semibold text-signal-black transition hover:bg-white disabled:cursor-wait disabled:opacity-70"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <RotateCw size={16} />}
            Request Signal
          </button>
        </div>
      </section>

      {message ? (
        <div className="border border-signal-gold/40 bg-signal-gold/10 p-4 text-sm text-signal-fog">
          {message}
        </div>
      ) : null}

      {activeSession ? (
        <TextAdventurePanel
          card={activeCard}
          session={activeSession}
          advancing={advancing}
          onAdvance={advanceMission}
          onClose={closeCompletion}
        />
      ) : (
        <SignalCardGrid
          cards={cards}
          loading={loading}
          generating={generating}
          onStart={startMission}
          onGenerate={requestSignal}
        />
      )}

      {stream?.mirrorReceipts.length ? (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <SquareTerminal className="text-signal-glass" size={20} />
            <h2 className="font-display text-3xl text-white">Recent Transmissions</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {stream.mirrorReceipts.map((receipt) => (
              <article key={receipt.mirrorReceiptId} className="border border-white/10 bg-signal-panel/60 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-signal-glass">{receipt.displayMode}</p>
                <p className="mt-3 text-sm leading-6 text-signal-fog/76">
                  {receipt.techniquesDemonstrated.slice(0, 2).join(" / ") || receipt.contextType}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SignalCardGrid({
  cards,
  loading,
  generating,
  onStart,
  onGenerate,
}: {
  cards: SignalCard[];
  loading: boolean;
  generating: boolean;
  onStart: (card: SignalCard) => void;
  onGenerate: () => void;
}) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1].map((index) => (
          <div key={index} className="glass-panel h-72 animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  if (!cards.length) {
    return (
      <section className="border border-white/12 bg-signal-panel/64 p-8">
        <Sparkles className="text-signal-red" />
        <h3 className="mt-5 font-display text-3xl text-white">No active Signal</h3>
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="mt-6 inline-flex items-center gap-2 bg-white/92 px-4 py-3 text-sm font-semibold text-signal-black transition hover:bg-white disabled:cursor-wait disabled:opacity-70"
        >
          {generating ? <Loader2 size={16} className="animate-spin" /> : <RotateCw size={16} />}
          Request Signal
        </button>
      </section>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {cards.map((card) => (
        <article key={card.generatedMissionInstanceId} className="glass-panel rounded-md p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-signal-glass">{cardLabel(card)}</p>
              <h3 className="mt-3 font-display text-3xl text-white">{card.title}</h3>
            </div>
            {card.playableOnWeb ? <Play className="shrink-0 text-signal-red" /> : <Smartphone className="shrink-0 text-signal-gold" />}
          </div>
          <p className="mt-4 min-h-24 leading-7 text-signal-fog/76">{card.description}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-signal-fog/64">
            <span className="border border-white/10 px-2 py-1">{card.locationMode}</span>
            <span className="border border-white/10 px-2 py-1">{card.intensity}</span>
            {card.estimatedMinutes ? <span className="border border-white/10 px-2 py-1">{card.estimatedMinutes} min</span> : null}
            {card.xp ? <span className="border border-white/10 px-2 py-1">{card.xp} XP</span> : null}
          </div>
          <p className="mt-5 text-sm leading-6 text-signal-fog/68">{card.rewardSummary}</p>
          <button
            type="button"
            onClick={() => onStart(card)}
            disabled={!card.playableOnWeb}
            title={card.unavailableReason ?? "Start Mission"}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/45 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {card.playableOnWeb ? <Play size={16} /> : <ShieldAlert size={16} />}
            {card.playableOnWeb ? "Start Mission" : card.unavailableReason}
          </button>
        </article>
      ))}
    </section>
  );
}

function TextAdventurePanel({
  card,
  session,
  advancing,
  onAdvance,
  onClose,
}: {
  card: SignalCard | null;
  session: GeneratedTextAdventureSession;
  advancing: boolean;
  onAdvance: (choiceId: string) => void;
  onClose: () => void;
}) {
  const completed = session.status === "COMPLETED";
  const currentStep = session.currentStep;

  return (
    <section className="glass-panel rounded-md p-5 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-signal-red">{card?.title ?? "Text Adventure"}</p>
          <h3 className="mt-3 font-display text-4xl text-white">
            {completed ? session.finalReflection?.title ?? "Mission Complete" : `Step ${session.currentStepIndex + 1}`}
          </h3>
        </div>
        <div className="border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.16em] text-signal-fog/70">
          {session.status}
        </div>
      </div>

      {completed ? (
        <CompletionView session={session} onClose={onClose} />
      ) : currentStep ? (
        <div className="mt-7">
          <p className="whitespace-pre-wrap text-lg leading-8 text-signal-fog/84">{currentStep.sceneText}</p>
          <div className="mt-7 grid gap-3">
            {currentStep.choices.map((choice) => (
              <button
                key={choice.choiceId}
                type="button"
                onClick={() => onAdvance(choice.choiceId)}
                disabled={advancing || session.status === "GENERATING"}
                className="flex min-h-16 items-center justify-between gap-4 border border-white/14 bg-black/18 px-4 py-3 text-left text-white transition hover:border-signal-glass/55 disabled:cursor-wait disabled:opacity-60"
              >
                <span>{choice.label}</span>
                {advancing || session.status === "GENERATING" ? <Loader2 size={16} className="shrink-0 animate-spin" /> : <Play size={16} className="shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-7 flex items-center gap-3 text-signal-fog/75">
          <Loader2 className="animate-spin" />
          <span>Resolving Mission state.</span>
        </div>
      )}

      {session.errorMessage ? <p className="mt-5 text-sm text-signal-gold">{session.errorMessage}</p> : null}
    </section>
  );
}

function CompletionView({ session, onClose }: { session: GeneratedTextAdventureSession; onClose: () => void }) {
  const completion = session.completion;
  return (
    <div className="mt-7">
      {session.finalReflection ? (
        <div className="space-y-5 text-signal-fog/82">
          <p className="whitespace-pre-wrap text-lg leading-8">{session.finalReflection.finalText}</p>
          <p className="leading-7">{session.finalReflection.moralLearning}</p>
          <p className="leading-7 text-signal-glass">{session.finalReflection.reflectionQuestion}</p>
        </div>
      ) : null}

      {completion ? (
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <StatTile label="Level" value={String(completion.progression.level)} />
          <StatTile label="XP" value={completion.progression.xp.toLocaleString()} />
          <StatTile label="Rewards" value={String(completion.rewards.length)} />
        </div>
      ) : null}

      {completion?.rewards.length ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {completion.rewards.map((reward) => (
            <article key={reward.missionRewardId} className="border border-white/10 bg-black/18 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-signal-red">{reward.rewardType}</p>
              <h4 className="mt-2 text-xl font-semibold text-white">{reward.title}</h4>
              <p className="mt-2 text-sm leading-6 text-signal-fog/70">{reward.body}</p>
            </article>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onClose}
        className="mt-7 inline-flex items-center gap-2 bg-white/92 px-4 py-3 text-sm font-semibold text-signal-black transition hover:bg-white"
      >
        <CheckCircle2 size={16} />
        Acknowledge
      </button>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-signal-panel/58 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-signal-glass">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function cardLabel(card: SignalCard) {
  if (card.eventType === "TEXT_ADVENTURE") return "Text Adventure";
  if (card.eventType === "AR_MISSION") return "Phone AR";
  if (card.eventType === "REMOTE_MISSION") return "Remote Mission";
  return card.eventType.replaceAll("_", " ");
}

async function pollGeneration(generationRequestId: string) {
  for (let attempt = 0; attempt < 16; attempt += 1) {
    await delay(2500);
    const response = await fetch(`/api/signals/generation-request?generationRequestId=${encodeURIComponent(generationRequestId)}`, {
      method: "GET",
      cache: "no-store",
    });
    const body = (await response.json()) as GenerationResponse;
    const status = body.request?.status;
    if (!response.ok || !status || status === "COMPLETED" || status === "FAILED" || status === "FALLBACK_RECOMMENDED") {
      return;
    }
  }
}

async function pollSession(sessionId: string) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await delay(1800);
    const response = await fetch(`/api/signals/text-adventure/session?sessionId=${encodeURIComponent(sessionId)}`, {
      method: "GET",
      cache: "no-store",
    });
    const body = (await response.json()) as SessionResponse;
    if (!response.ok || !body.session || body.session.status !== "GENERATING") {
      return body.session ?? null;
    }
  }
  return null;
}

function clientRequestId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `web_${Date.now()}`;
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
