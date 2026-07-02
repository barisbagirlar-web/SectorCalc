import React from "react";

export function useTranslations<T = any>(namespaceOrConfig?: any): any {
  function t(key: string, values?: Record<string, any>) {
    return key;
  }
  t.has = (key: string) => true;
  t.raw = (key: string): any => key;
  t.markup = (key: string, ...args: any[]) => key;
  t.rich = (key: string, ...args: any[]) => key;
  return t;
}

export function getTranslations<T = any>(namespaceOrConfig?: any): any {
  function t(key: string, values?: Record<string, any>) {
    return key;
  }
  t.has = (key: string) => true;
  t.raw = (key: string): any => key;
  t.markup = (key: string, ...args: any[]) => key;
  t.rich = (key: string, ...args: any[]) => key;
  return t;
}

export function useLocale() {
  return "en";
}

export function getLocale() {
  return "en";
}

export function getRequestConfig() {
  return {};
}

export function useFormatter() {
  return {
    number: (val: number) => val.toString(),
    dateTime: (val: Date) => val.toString(),
    relativeTime: (val: Date) => val.toString(),
    list: (val: string[]) => val.join(", "),
  };
}

export function setRequestLocale(locale: string) {
  // no-op
}

export function NextIntlClientProvider(props: any) {
  return props.children;
}

export async function getMessages(args?: any) {
  return {};
}
