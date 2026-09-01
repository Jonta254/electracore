import type { EnhancedLesson } from "./enhancedLessons";

type LessonMap = Record<string, EnhancedLesson>;

function select(maps: LessonMap[], slug: string, lessonId: string) {
  const key = `${slug}:${lessonId}`;
  return maps.find(map => map[key])?.[key];
}

export async function loadEnhancedLesson(slug: string, lessonId: string): Promise<EnhancedLesson | undefined> {
  switch (slug) {
    case "domestic-wiring": {
      const modules = await Promise.all([
        import("./domesticConsumerUnitLessons"), import("./domesticFinalCircuitLessons"),
        import("./domesticLightingEarthingLessons"), import("./domesticLocationsCablesLessons"),
        import("./domesticFaultRegulationLessons"),
      ]);
      return select(modules.map(module => Object.values(module)[0] as LessonMap), slug, lessonId);
    }
    case "protection-fault-analysis": {
      const modules = await Promise.all([
        import("./protectionDeviceLessons"), import("./protectionLoopLessons"),
        import("./protectionRcdPfcLessons"), import("./protectionCoordinationTestingLessons"),
      ]);
      return select(modules.map(module => Object.values(module)[0] as LessonMap), slug, lessonId);
    }
    case "three-phase-systems": {
      const modules = await Promise.all([
        import("./threePhaseFundamentalsLessons"), import("./threePhaseDeltaPowerLessons"), import("./threePhaseMachinesLessons"),
      ]);
      return select(modules.map(module => Object.values(module)[0] as LessonMap), slug, lessonId);
    }
    case "cable-sizing": {
      const modules = await Promise.all([
        import("./cableCccDeratingLessons"), import("./cableVoltageSwaLessons"), import("./cableFireDesignLessons"),
      ]);
      return select(modules.map(module => Object.values(module)[0] as LessonMap), slug, lessonId);
    }
    case "solar-pv": {
      const modules = await Promise.all([
        import("./solarPhysicsDesignLessons"), import("./solarInverterBatteryLessons"), import("./solarGridCommissioningLessons"),
      ]);
      return select(modules.map(module => Object.values(module)[0] as LessonMap), slug, lessonId);
    }
    case "industrial-control": {
      const modules = await Promise.all([
        import("./industrialStarterProtectionLessons"), import("./industrialDiagramSafetyLessons"), import("./industrialPlcPanelLessons"),
      ]);
      return select(modules.map(module => Object.values(module)[0] as LessonMap), slug, lessonId);
    }
    case "inspection-testing": {
      const modules = await Promise.all([
        import("./inspectionPreparationContinuityLessons"), import("./inspectionIrLoopLessons"),
        import("./inspectionRcdPfcLessons"), import("./inspectionCertificationLessons"),
      ]);
      return select(modules.map(module => Object.values(module)[0] as LessonMap), slug, lessonId);
    }
    case "led-lighting": {
      const modules = await Promise.all([import("./ledTechnologyDriverLessons"), import("./ledEmergencyDesignLessons")]);
      return select(modules.map(module => Object.values(module)[0] as LessonMap), slug, lessonId);
    }
    default: {
      const { getEnhancedLesson } = await import("./enhancedLessons");
      return getEnhancedLesson(slug, lessonId);
    }
  }
}
