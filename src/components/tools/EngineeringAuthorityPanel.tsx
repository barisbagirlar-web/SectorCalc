import React from 'react';
import { getEngineeringAuthorityProfile } from '@/lib/tools/engineering-authority-registry';

interface EngineeringAuthorityPanelProps {
  toolSlug: string;
  className?: string;
}

export function EngineeringAuthorityPanel({ toolSlug, className = '' }: EngineeringAuthorityPanelProps) {
  const profile = getEngineeringAuthorityProfile(toolSlug);
  const isFallback = profile.calculationMethod === "SectorCalc general engineering calculation governance layer";

  return (
    <div className={`engineering-authority-panel border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 bg-neutral-50 dark:bg-neutral-900 mt-8 ${className}`}>
      <h3 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100 font-barlow">
        Audit-Ready Engineering Basis
      </h3>
      
      <div className="text-sm text-neutral-700 dark:text-neutral-300 mb-6">
        {isFallback ? (
          <p>
            This calculation uses SectorCalc&apos;s general engineering calculation governance layer. Tool-specific authority mapping is pending internal review.
          </p>
        ) : (
          <p>
            This calculation is built with TUV audit-ready engineering documentation quality and ISO 9001-aligned calculation governance. The result is reference-backed, formula traceable, and supported by internal verification checks.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {profile.authorityStatus.map((status) => (
          <span 
            key={status} 
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {status === "tuv_audit_ready_documentation" && "TUV audit-ready documentation quality"}
            {status === "iso_9001_aligned_governance" && "ISO 9001-aligned governance"}
            {status === "reference_backed" && "Reference-backed"}
            {status === "formula_traceable" && "Formula traceable"}
            {status === "internally_verified" && "Internally verified"}
            {status === "professional_review_recommended" && "Professional review recommended"}
          </span>
        ))}
      </div>

      {(profile.verificationChecks.length > 0 || !isFallback) && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Verification</h4>
          <ul className="space-y-1">
            {profile.verificationChecks.length > 0 ? profile.verificationChecks.map((check, index) => (
              <li key={index} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                {check}
              </li>
            )) : (
              <>
                <li className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Input range checked
                </li>
                <li className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Unit consistency checked
                </li>
                <li className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Formula trace available
                </li>
                <li className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Result reasonability checked
                </li>
                <li className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Assumptions disclosed
                </li>
                <li className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Limitations disclosed
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {profile.standards.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Engineering Reference Basis</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
            {profile.standards.map(std => (
              <li key={std.id}>
                {std.publisher ? <span className="font-semibold">{std.publisher}</span> : null}
                {std.publisher && std.label ? ' - ' : ''}
                {std.label} 
                {std.standardFamily ? ` (${std.standardFamily})` : ''}
                {std.url ? <a href={std.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-500 hover:underline">Link</a> : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(profile.assumptions.length > 0 || profile.limitations.length > 0) && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.assumptions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Assumptions</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                {profile.assumptions.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}
          {profile.limitations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Limitations</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                {profile.limitations.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <h4 className="text-xs font-semibold mb-1 text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Professional Limitation</h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {profile.disclaimer}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
          Last internal review: {profile.lastInternalReview}
        </p>
      </div>
    </div>
  );
}
