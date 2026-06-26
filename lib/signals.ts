export type WebsiteAccount = {
  profile?: {
    playerId: string;
    pseudonym: string;
    homeTerritoryId?: string | null;
    hasSafeHaven?: boolean | null;
    safeHavenMode?: string | null;
    safeHavenTerritoryId?: string | null;
    intensitySetting: string;
    boundaries: string[];
    updatedAt: string;
  } | null;
  wallet: {
    balance: number;
    updatedAt: string;
  };
  profileObjects: Array<{
    objectId: string;
    displayName: string;
    sourceSku?: string | null;
    acquiredAt: string;
  }>;
};

export type PlayerProgression = {
  playerId: string;
  level: number;
  rank: string;
  factionId?: string | null;
  completedMissionCount: number;
  xp: number;
  updatedAt: string;
};

export type MirrorReceipt = {
  mirrorReceiptId: string;
  contextType: string;
  contextRefId: string;
  influencingSignals: string[];
  techniquesDemonstrated: string[];
  resistanceGuidance: string[];
  displayMode: string;
  createdAt: string;
};

export type SignalCard = {
  generatedMissionInstanceId: string;
  streamEventId: string;
  title: string;
  description: string;
  eventType: string;
  actionTargetType: string | null;
  locationMode: string;
  intensity: string;
  estimatedMinutes: number | null;
  storyBeatId: string;
  rewardSummary: string;
  xp: number | null;
  updatedAt: string;
  playableOnWeb: boolean;
  unavailableReason: string | null;
};

export type SignalStreamState = {
  account: WebsiteAccount | null;
  progression: PlayerProgression | null;
  cards: SignalCard[];
  mirrorReceipts: MirrorReceipt[];
};

export type GeneratedTextAdventureChoice = {
  choiceId: string;
  label: string;
  summary?: string | null;
};

export type GeneratedTextAdventureStep = {
  stepId: string;
  stepIndex: number;
  sceneText: string;
  choices: GeneratedTextAdventureChoice[];
  selectedChoiceId?: string | null;
};

export type GeneratedTextAdventureFinalReflection = {
  title: string;
  finalText: string;
  moralLearning: string;
  reflectionQuestion: string;
  rewardSummary: string;
  techniques: string[];
};

export type MissionReward = {
  missionRewardId: string;
  rewardType: string;
  title: string;
  body: string;
  createdAt: string;
};

export type MissionCompletionPayload = {
  completion: {
    missionCompletionId: string;
    missionId: string;
    completedAt: string;
    validationStatus: string;
  };
  progression: PlayerProgression;
  rewards: MissionReward[];
  mirrorReceipts: MirrorReceipt[];
  generatedMissionCompletionId?: string | null;
};

export type GeneratedTextAdventureSession = {
  sessionId: string;
  generatedMissionInstanceId: string;
  generationRequestId: string;
  storyBeatId: string;
  status: "ACTIVE" | "GENERATING" | "COMPLETED" | "FAILED";
  currentStepIndex: number;
  maxStorySteps: number;
  steps: GeneratedTextAdventureStep[];
  currentStep: GeneratedTextAdventureStep | null;
  finalReflection: GeneratedTextAdventureFinalReflection | null;
  completion: MissionCompletionPayload | null;
  errorMessage: string | null;
};

export type AppSyncSignalsData = {
  getMyWebsiteAccount?: WebsiteAccount | null;
  getMyProgression?: PlayerProgression | null;
  listMyApprovedGeneratedMissions?: {
    items?: AppSyncGeneratedMissionInstance[];
    nextToken?: string | null;
  } | null;
  listMyMirrorReceipts?: {
    items?: MirrorReceipt[];
    nextToken?: string | null;
  } | null;
};

type AppSyncGeneratedMissionInstance = {
  instanceId: string;
  storyBeatId: string;
  eventCard: unknown;
  mission: unknown;
  payload?: unknown;
  rewards: unknown;
  updatedAt: string;
};

export type AppSyncSignalContextData = {
  getMyWebsiteAccount?: WebsiteAccount | null;
  getMyProgression?: PlayerProgression | null;
  listMyApprovedGeneratedMissions?: {
    items?: Array<{ instanceId: string }>;
  } | null;
};

export type AppSyncTextAdventureSessionPayload = {
  session?: AppSyncTextAdventureSession | null;
};

type AppSyncTextAdventureSession = {
  sessionId: string;
  generatedMissionInstanceId: string;
  generationRequestId: string;
  storyBeatId: string;
  status: string;
  currentStepIndex: number;
  maxStorySteps: number;
  steps: AppSyncTextAdventureStep[];
  currentStep?: AppSyncTextAdventureStep | null;
  finalReflection?: AppSyncTextAdventureFinalReflection | null;
  completion?: AppSyncCompleteMissionPayload | null;
  error?: unknown;
};

type AppSyncTextAdventureStep = {
  stepId: string;
  stepIndex: number;
  sceneText: string;
  choices: GeneratedTextAdventureChoice[];
  selectedChoiceId?: string | null;
};

type AppSyncTextAdventureFinalReflection = {
  title: string;
  finalText: string;
  moralLearning: string;
  reflectionQuestion: string;
  rewardSummary: string;
  techniques: string[];
};

type AppSyncCompleteMissionPayload = {
  completion: MissionCompletionPayload["completion"];
  progression: PlayerProgression;
  rewards: MissionReward[];
  mirrorReceipts: MirrorReceipt[];
  generatedCompletion?: {
    generatedMissionCompletionId: string;
  } | null;
};

export const signalsQuery = /* GraphQL */ `
  query WebsiteSignalStream($limit: Int!, $receiptLimit: Int!) {
    getMyWebsiteAccount {
      profile {
        playerId
        pseudonym
        homeTerritoryId
        hasSafeHaven
        safeHavenMode
        safeHavenTerritoryId
        intensitySetting
        boundaries
        updatedAt
      }
      wallet {
        balance
        updatedAt
      }
      profileObjects {
        objectId
        displayName
        sourceSku
        acquiredAt
      }
    }
    getMyProgression {
      playerId
      level
      rank
      factionId
      completedMissionCount
      xp
      updatedAt
    }
    listMyApprovedGeneratedMissions(limit: $limit) {
      items {
        instanceId
        storyBeatId
        eventCard
        mission
        payload
        rewards
        updatedAt
      }
      nextToken
    }
    listMyMirrorReceipts(limit: $receiptLimit) {
      items {
        mirrorReceiptId
        contextType
        contextRefId
        influencingSignals
        techniquesDemonstrated
        resistanceGuidance
        displayMode
        createdAt
      }
      nextToken
    }
  }
`;

export const signalGenerationContextQuery = /* GraphQL */ `
  query WebsiteSignalGenerationContext {
    getMyWebsiteAccount {
      profile {
        homeTerritoryId
        hasSafeHaven
        safeHavenMode
        safeHavenTerritoryId
        intensitySetting
        boundaries
      }
      wallet {
        balance
      }
      profileObjects {
        objectId
      }
    }
    getMyProgression {
      level
    }
    listMyApprovedGeneratedMissions(limit: 4) {
      items {
        instanceId
      }
    }
  }
`;

export const requestGeneratedMissionsMutation = /* GraphQL */ `
  mutation WebsiteRequestGeneratedMissions($input: RequestGeneratedMissionsInput!) {
    requestGeneratedMissions(input: $input) {
      generationRequestId
      status
      fallbackRecommended
      createdAt
      updatedAt
    }
  }
`;

export const generatedMissionRequestQuery = /* GraphQL */ `
  query WebsiteGeneratedMissionRequest($generationRequestId: ID!) {
    getMyGeneratedMissionRequest(generationRequestId: $generationRequestId) {
      generationRequestId
      status
      fallbackRecommended
      createdAt
      updatedAt
    }
  }
`;

const textAdventureSessionFragment = /* GraphQL */ `
  fragment WebsiteTextAdventureSessionFields on GeneratedTextAdventureSession {
    sessionId
    generatedMissionInstanceId
    generationRequestId
    storyBeatId
    status
    currentStepIndex
    maxStorySteps
    steps {
      stepId
      stepIndex
      sceneText
      choices {
        choiceId
        label
        summary
      }
      selectedChoiceId
    }
    currentStep {
      stepId
      stepIndex
      sceneText
      choices {
        choiceId
        label
        summary
      }
      selectedChoiceId
    }
    finalReflection {
      title
      finalText
      moralLearning
      reflectionQuestion
      rewardSummary
      techniques
    }
    completion {
      completion {
        missionCompletionId
        missionId
        completedAt
        validationStatus
      }
      progression {
        playerId
        level
        rank
        factionId
        completedMissionCount
        xp
        updatedAt
      }
      rewards {
        missionRewardId
        rewardType
        title
        body
        createdAt
      }
      mirrorReceipts {
        mirrorReceiptId
        contextType
        contextRefId
        influencingSignals
        techniquesDemonstrated
        resistanceGuidance
        displayMode
        createdAt
      }
      generatedCompletion {
        generatedMissionCompletionId
      }
    }
    error
  }
`;

export const startTextAdventureMutation = /* GraphQL */ `
  mutation WebsiteStartGeneratedTextAdventure($input: StartGeneratedTextAdventureInput!) {
    startGeneratedTextAdventure(input: $input) {
      session {
        ...WebsiteTextAdventureSessionFields
      }
    }
  }
  ${textAdventureSessionFragment}
`;

export const advanceTextAdventureMutation = /* GraphQL */ `
  mutation WebsiteAdvanceGeneratedTextAdventure($input: AdvanceGeneratedTextAdventureInput!) {
    advanceGeneratedTextAdventure(input: $input) {
      session {
        ...WebsiteTextAdventureSessionFields
      }
    }
  }
  ${textAdventureSessionFragment}
`;

export const textAdventureSessionQuery = /* GraphQL */ `
  query WebsiteGeneratedTextAdventureSession($sessionId: ID!) {
    getGeneratedTextAdventureSession(sessionId: $sessionId) {
      session {
        ...WebsiteTextAdventureSessionFields
      }
    }
  }
  ${textAdventureSessionFragment}
`;

export function normalizeSignalStream(data: AppSyncSignalsData): SignalStreamState {
  const items = data.listMyApprovedGeneratedMissions?.items ?? [];
  return {
    account: data.getMyWebsiteAccount ?? null,
    progression: data.getMyProgression ?? null,
    cards: items.map(normalizeSignalCard).filter((card): card is SignalCard => Boolean(card)),
    mirrorReceipts: data.listMyMirrorReceipts?.items ?? [],
  };
}

export function buildWebsiteGenerationInput(data: AppSyncSignalContextData) {
  const profile = data.getMyWebsiteAccount?.profile ?? null;
  const level = Math.max(1, data.getMyProgression?.level ?? 1);
  const recentMissionIds = (data.listMyApprovedGeneratedMissions?.items ?? [])
    .map((item) => item.instanceId)
    .filter((id) => typeof id === "string" && id.length > 0);

  return {
    storyBeatId: "beat_signal_stream_runtime",
    requestedCount: 1,
    generationMode: "BATCH",
    entitlement: "PAID_BATCH_GENERATED",
    currentNarrativeStage: level >= 3 ? "STREET_FACTION" : "CALIBRATION",
    level,
    completedStoryBeatIds: [],
    broadTerritoryId: profile?.homeTerritoryId ?? profile?.safeHavenTerritoryId ?? null,
    hasSafeHaven: Boolean(profile?.hasSafeHaven),
    safeHavenMode: profile?.safeHavenMode ?? null,
    safeHavenTerritoryId: profile?.safeHavenTerritoryId ?? null,
    declaredSafetyBoundaries: Array.isArray(profile?.boundaries) ? profile.boundaries : [],
    selectedIntensity: profile?.intensitySetting ?? "STANDARD",
    playMode: "REMOTE",
    recentMissionIds,
    allowedSignals: [
      "level",
      "completedStoryBeatIds",
      "broadTerritoryId",
      "hasSafeHaven",
      "safeHavenMode",
      "safeHavenTerritoryId",
      "selectedIntensity",
      "playMode",
      "recentMissionIds",
      "entitlement",
    ],
    sourceTemplateId: null,
    refreshIntent: "web_signal_stream",
  };
}

export function normalizeTextAdventureSessionPayload(payload: AppSyncTextAdventureSessionPayload | undefined | null) {
  const session = payload?.session;
  if (!session) return null;
  const status = normalizeSessionStatus(session.status);
  const steps = session.steps.map(normalizeTextAdventureStep);
  const currentStep = session.currentStep ? normalizeTextAdventureStep(session.currentStep) : steps.at(-1) ?? null;
  return {
    sessionId: session.sessionId,
    generatedMissionInstanceId: session.generatedMissionInstanceId,
    generationRequestId: session.generationRequestId,
    storyBeatId: session.storyBeatId,
    status,
    currentStepIndex: session.currentStepIndex,
    maxStorySteps: session.maxStorySteps,
    steps,
    currentStep,
    finalReflection: session.finalReflection ? { ...session.finalReflection } : null,
    completion: session.completion ? normalizeCompletion(session.completion) : null,
    errorMessage: readErrorMessage(session.error),
  } satisfies GeneratedTextAdventureSession;
}

export async function readJsonRecord(request: Request) {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function readSafeId(body: Record<string, unknown> | null, fieldName: string) {
  const value = body?.[fieldName];
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return /^[A-Za-z0-9_.:-]{3,180}$/.test(trimmed) ? trimmed : null;
}

function normalizeSignalCard(instance: AppSyncGeneratedMissionInstance): SignalCard | null {
  const eventCard = parseAwsJsonRecord(instance.eventCard);
  const mission = parseAwsJsonRecord(instance.mission);
  const payload = parseAwsJsonRecord(instance.payload);
  const rewards = parseAwsJsonRecord(instance.rewards);
  const actionTarget = readRecord(eventCard.actionTarget) ?? readRecord(mission.actionTarget);
  const eventType = readString(eventCard.eventType) ?? readString(mission.eventType) ?? readString(payload.type) ?? "UNKNOWN";
  const actionTargetType = readString(actionTarget?.type) ?? null;
  const playableOnWeb = eventType === "TEXT_ADVENTURE" && actionTargetType === "TEXT_ADVENTURE";
  return {
    generatedMissionInstanceId: instance.instanceId,
    streamEventId: `generated_${instance.instanceId}`,
    title: readString(eventCard.title) ?? "Generated Signal",
    description: readString(eventCard.shortText) ?? readString(mission.plainActionSummary) ?? "A backend-approved Mission is ready.",
    eventType,
    actionTargetType,
    locationMode: readString(eventCard.locationMode) ?? readString(mission.locationMode) ?? "REMOTE",
    intensity: readString(eventCard.intensity) ?? "LOW",
    estimatedMinutes: readNumber(eventCard.estimatedMinutes) ?? readNumber(mission.estimatedMinutes),
    storyBeatId: instance.storyBeatId,
    rewardSummary: readString(rewards.summary) ?? "Progression will update after completion.",
    xp: readNumber(rewards.xp),
    updatedAt: instance.updatedAt,
    playableOnWeb,
    unavailableReason: playableOnWeb ? null : "Open on phone",
  };
}

function normalizeTextAdventureStep(step: AppSyncTextAdventureStep): GeneratedTextAdventureStep {
  return {
    stepId: step.stepId,
    stepIndex: step.stepIndex,
    sceneText: step.sceneText,
    choices: step.choices.map((choice) => ({
      choiceId: choice.choiceId,
      label: choice.label,
      summary: choice.summary ?? null,
    })),
    selectedChoiceId: step.selectedChoiceId ?? null,
  };
}

function normalizeCompletion(completion: AppSyncCompleteMissionPayload): MissionCompletionPayload {
  return {
    completion: completion.completion,
    progression: completion.progression,
    rewards: completion.rewards,
    mirrorReceipts: completion.mirrorReceipts,
    generatedMissionCompletionId: completion.generatedCompletion?.generatedMissionCompletionId ?? null,
  };
}

function normalizeSessionStatus(status: string): GeneratedTextAdventureSession["status"] {
  if (status === "ACTIVE" || status === "GENERATING" || status === "COMPLETED" || status === "FAILED") {
    return status;
  }
  return "FAILED";
}

function readErrorMessage(value: unknown) {
  const parsed = parseAwsJson(value);
  if (typeof parsed === "string") return parsed;
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const message = (parsed as Record<string, unknown>).message;
    return typeof message === "string" ? message : null;
  }
  return null;
}

function parseAwsJsonRecord(value: unknown): Record<string, unknown> {
  const parsed = parseAwsJson(value);
  return readRecord(parsed) ?? {};
}

function parseAwsJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
