"use client";

import { Button } from "@/components/ui/button";
import { t } from "@/common/i18n";
import {
  useHealthEchoMutation,
  useHealthErrorDemoMutation,
  useHealthQuery,
} from "@/queries/health";

const HealthClientDemo = () => {
  const { data, isLoading } = useHealthQuery();
  const echoMutation = useHealthEchoMutation();
  const errorDemoMutation = useHealthErrorDemoMutation();

  return (
    <section className="mx-auto flex max-w-lg flex-col gap-4 p-8">
      <h1 className="text-xl font-semibold">{t("dev.healthTitle")}</h1>

      {isLoading ? (
        <p className="text-muted-foreground">{t("common.loading")}</p>
      ) : data ? (
        <p className="text-sm text-muted-foreground">
          {t("dev.healthStatus", {
            status: data.status,
            appName: data.appName,
          })}
        </p>
      ) : null}

      {echoMutation.data ? (
        <p className="text-sm">
          {t("dev.echoResult", {
            value: echoMutation.data.data.sampleField,
          })}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="default"
          disabled={echoMutation.isPending}
          onClick={() =>
            echoMutation.mutate({
              sampleField: "nestedCaseCheck",
              nestedItems: [{ innerValue: 42 }],
            })
          }
        >
          {t("dev.triggerSuccessToast")}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={errorDemoMutation.isPending}
          onClick={() => errorDemoMutation.mutate()}
        >
          {t("dev.triggerErrorToast")}
        </Button>
      </div>
    </section>
  );
};

export default HealthClientDemo;
