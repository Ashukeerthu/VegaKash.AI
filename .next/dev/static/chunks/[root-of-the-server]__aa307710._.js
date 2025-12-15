(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/src/pages/in/calculators/home-loan-affordability.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'react-router-dom'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../../components/AEOContentSection'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../../components/SEO'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../../components/Breadcrumb'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../../styles/Calculator.css'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../../styles/SEOContent.css'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../../styles/AEOContent.css'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
/**
 * India Home Loan Affordability Calculator - GLOBAL & COUNTRY-SPECIFIC
 * Calculates home loan eligibility based on Indian banking norms (FOIR, LTV, income multipliers)
 * Includes processing fees, registration charges, and GST considerations
 */ function MortgageAffordabilityCalculatorIndia() {
    _s();
    const { country } = useParams();
    const breadcrumbItems = [
        {
            label: 'Home',
            path: '/',
            icon: true
        },
        {
            label: 'Calculators',
            path: '/calculators'
        },
        {
            label: 'India Home Loan Affordability',
            path: null
        }
    ];
    // Income inputs
    const [annualIncome, setAnnualIncome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(1200000); // ₹12 lakhs
    const [spouseIncome, setSpouseIncome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0); // Joint application
    const [otherIncome, setOtherIncome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0); // Rental, etc.
    // Applicant details
    const [applicantAge, setApplicantAge] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(35); // Age in years
    const [employmentType, setEmploymentType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('salaried'); // salaried or self-employed
    const [creditScore, setCreditScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('750+'); // 750+, 700-749, 650-699, <650
    const [propertyType, setPropertyType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('ready'); // ready or under-construction
    const [housingCategory, setHousingCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('non-affordable'); // affordable or non-affordable
    const [bankType, setBankType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('private'); // PSU, Private, NBFC
    // Obligations
    const [existingEMI, setExistingEMI] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(15000); // ₹15k
    // Loan parameters
    const [interestRate, setInterestRate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(8.5); // Current avg rate
    const [loanTenure, setLoanTenure] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(20); // years
    const [propertyValue, setPropertyValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(5000000); // ₹50 lakhs
    // Advanced settings
    const [foir, setFoir] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(50); // Fixed Obligation to Income Ratio (%)
    const [ltv, setLtv] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(80); // Loan-to-Value ratio (%) - will be auto-adjusted
    const [includeCharges, setIncludeCharges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Memoize calculation inputs to prevent unnecessary recalculations
    const calculationInputs = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "MortgageAffordabilityCalculatorIndia.useMemo[calculationInputs]": ()=>({
                annualIncome,
                spouseIncome,
                otherIncome,
                existingEMI,
                interestRate,
                loanTenure,
                propertyValue,
                foir,
                ltv,
                includeCharges,
                applicantAge,
                employmentType,
                creditScore,
                propertyType,
                housingCategory,
                bankType
            })
    }["MortgageAffordabilityCalculatorIndia.useMemo[calculationInputs]"], [
        annualIncome,
        spouseIncome,
        otherIncome,
        existingEMI,
        interestRate,
        loanTenure,
        propertyValue,
        foir,
        ltv,
        includeCharges,
        applicantAge,
        employmentType,
        creditScore,
        propertyType,
        housingCategory,
        bankType
    ]);
    // Reusable dropdown style object
    const dropdownStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        fontSize: '0.95rem',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        fontWeight: '600',
        color: '#1e293b',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        backgroundImage: `linear-gradient(135deg, #ffffff 0%, #f8fafc 100%), url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23667eea' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundPosition: '0 0, right 1rem center',
        backgroundSize: 'auto, 20px',
        paddingRight: '3rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        outline: 'none'
    };
    const dropdownHoverStyle = {
        borderColor: '#667eea',
        boxShadow: '0 4px 6px -1px rgba(102, 126, 234, 0.1), 0 2px 4px -1px rgba(102, 126, 234, 0.06)',
        transform: 'translateY(-1px)'
    };
    const dropdownFocusStyle = {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)'
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "MortgageAffordabilityCalculatorIndia.useEffect": ()=>{
            calculateAffordability();
        }
    }["MortgageAffordabilityCalculatorIndia.useEffect"], [
        calculationInputs
    ]);
    const calculateAffordability = ()=>{
        // Apply Bank Type specific FOIR
        let bankFOIR = parseFloat(foir);
        if (bankType === 'psu') {
            bankFOIR = Math.min(bankFOIR, 55); // PSU banks are conservative
        } else if (bankType === 'private') {
            bankFOIR = Math.min(bankFOIR, 60); // Private banks allow more
        } else if (bankType === 'nbfc') {
            bankFOIR = Math.min(bankFOIR, 65); // NBFCs are most flexible
        }
        // Apply Income Weightage (Indian Banking Standard)
        // Primary income: 100%, Spouse: 75%, Other (rental): 60%
        const primaryIncome = parseFloat(annualIncome);
        const coApplicantIncome = parseFloat(spouseIncome) * 0.75; // 75% weightage for co-applicant
        const rentalOtherIncome = parseFloat(otherIncome) * 0.6; // 60% weightage for rental/other income
        const totalAnnualIncome = primaryIncome + parseFloat(spouseIncome) + parseFloat(otherIncome); // Total income before weightage
        const effectiveAnnualIncome = primaryIncome + coApplicantIncome + rentalOtherIncome;
        const monthlyIncome = effectiveAnnualIncome / 12;
        if (!monthlyIncome || monthlyIncome <= 0) return;
        // Apply Age-Based Tenure Cap (Indian Banking Standard)
        const retirementAge = employmentType === 'salaried' ? 60 : 65;
        const maxTenureByAge = retirementAge - parseInt(applicantAge);
        const effectiveTenure = Math.min(parseFloat(loanTenure), maxTenureByAge, 30); // Cap at 30 years max
        if (effectiveTenure <= 0) {
            setResult({
                eligible: false,
                message: 'Your age does not permit a home loan. Please check your age or retirement age.'
            });
            return;
        }
        // FOIR-based calculation (using bank-specific FOIR)
        const maxMonthlyEMI = monthlyIncome * (bankFOIR / 100) - parseFloat(existingEMI);
        if (maxMonthlyEMI <= 0) {
            setResult({
                eligible: false,
                message: 'Your existing EMI exceeds the maximum allowed FOIR. Please reduce existing obligations.'
            });
            return;
        }
        // Apply credit score impact on interest rate
        let effectiveInterestRate = parseFloat(interestRate);
        if (creditScore === '700-749') {
            effectiveInterestRate += 0.25;
        } else if (creditScore === '650-699') {
            effectiveInterestRate += 0.75;
        } else if (creditScore === 'below-650') {
            effectiveInterestRate += 1.5;
        }
        // Calculate max loan based on EMI capacity
        const r = effectiveInterestRate / 100 / 12; // monthly rate (credit-adjusted)
        const n = effectiveTenure * 12; // total months (age-adjusted)
        let maxLoanByEMI = 0;
        if (r > 0) {
            // Reverse EMI formula: P = EMI × [(1+r)^n - 1] / [r(1+r)^n]
            maxLoanByEMI = maxMonthlyEMI * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
        } else {
            maxLoanByEMI = maxMonthlyEMI * n;
        }
        // Apply RBI LTV Slabs (Programmatic Enforcement)
        // As per RBI guidelines:
        // ≤ ₹30L: 90% LTV, ₹30-75L: 80% LTV, > ₹75L: 75% LTV
        let rbiMaxLTV = 90;
        const propValue = parseFloat(propertyValue);
        if (propValue <= 3000000) {
            rbiMaxLTV = 90; // Up to ₹30 lakhs
        } else if (propValue <= 7500000) {
            rbiMaxLTV = 80; // ₹30-75 lakhs
        } else {
            rbiMaxLTV = 75; // Above ₹75 lakhs
        }
        // Use the lower of user-selected LTV and RBI max LTV
        const effectiveLTV = Math.min(parseFloat(ltv), rbiMaxLTV);
        // Calculate max loan based on LTV
        const maxLoanByLTV = propValue * (effectiveLTV / 100);
        // Actual eligible loan is minimum of both
        const eligibleLoan = Math.min(maxLoanByEMI, maxLoanByLTV);
        // Calculate actual EMI for eligible loan
        let monthlyEMI = 0;
        if (r > 0) {
            monthlyEMI = eligibleLoan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        } else {
            monthlyEMI = eligibleLoan / n;
        }
        // Down payment required
        const downPayment = parseFloat(propertyValue) - eligibleLoan;
        // Calculate additional charges (if included)
        let processingFee = 0;
        let stampDutyAndRegistration = 0;
        let gst = 0;
        let legalCharges = 0;
        let totalUpfrontCost = downPayment;
        if (includeCharges) {
            // Processing fee: Typically 0.5% of loan amount (varies by bank)
            processingFee = eligibleLoan * 0.005;
            // Stamp duty and registration: Varies by state, average 5-7%
            stampDutyAndRegistration = parseFloat(propertyValue) * 0.06;
            // GST on under-construction property only
            if (propertyType === 'under-construction') {
                if (housingCategory === 'affordable') {
                    gst = parseFloat(propertyValue) * 0.01; // 1% for affordable
                } else {
                    gst = parseFloat(propertyValue) * 0.05; // 5% for non-affordable
                }
            } else {
                gst = 0; // No GST for ready-to-move
            }
            // Legal charges: Typically ₹5,000 - ₹25,000
            legalCharges = 15000;
            totalUpfrontCost = downPayment + processingFee + stampDutyAndRegistration + gst + legalCharges;
        }
        // Total interest payable
        const totalAmountPayable = monthlyEMI * n;
        const totalInterest = totalAmountPayable - eligibleLoan;
        // Calculate FOIR utilization (clamped to 100% max)
        const foirUtilization = Math.min((monthlyEMI + parseFloat(existingEMI)) / monthlyIncome * 100, 100);
        // Debt-to-income ratio (clamped to 100% max)
        const dti = Math.min((monthlyEMI + parseFloat(existingEMI)) / monthlyIncome * 100, 100);
        // Calculate typical multiplier range based on employment type
        const typicalMultiplierMin = employmentType === 'salaried' ? 4 : 3;
        const typicalMultiplierMax = employmentType === 'salaried' ? 6 : 5;
        setResult({
            eligible: true,
            eligibleLoan: Math.round(eligibleLoan),
            monthlyEMI: Math.round(monthlyEMI),
            downPayment: Math.round(downPayment),
            totalIncome: Math.round(primaryIncome + parseFloat(spouseIncome) + parseFloat(otherIncome)),
            effectiveIncome: Math.round(effectiveAnnualIncome),
            monthlyIncome: Math.round(monthlyIncome),
            maxMonthlyEMI: Math.round(maxMonthlyEMI),
            propertyValue: Math.round(propValue),
            ltvUsed: (eligibleLoan / propValue * 100).toFixed(1),
            effectiveLTV: effectiveLTV.toFixed(1),
            rbiMaxLTV: rbiMaxLTV,
            effectiveTenure: effectiveTenure,
            requestedTenure: parseFloat(loanTenure),
            tenureCapped: effectiveTenure < parseFloat(loanTenure),
            processingFee: Math.round(processingFee),
            stampDutyAndRegistration: Math.round(stampDutyAndRegistration),
            gst: Math.round(gst),
            legalCharges: Math.round(legalCharges),
            totalUpfrontCost: Math.round(totalUpfrontCost),
            totalAmountPayable: Math.round(totalAmountPayable),
            totalInterest: Math.round(totalInterest),
            foirUtilization: foirUtilization.toFixed(1),
            dti: dti.toFixed(1),
            incomeMultiplier: (eligibleLoan / effectiveAnnualIncome).toFixed(2),
            typicalMultiplierMin: typicalMultiplierMin,
            typicalMultiplierMax: typicalMultiplierMax,
            effectiveInterestRate: effectiveInterestRate.toFixed(2),
            creditScore: creditScore,
            limitingFactor: maxLoanByEMI < maxLoanByLTV ? 'FOIR' : 'LTV',
            // Approval probability calculation
            approvalProbability: (()=>{
                let score = 0;
                // FOIR component (30%)
                if (foirUtilization < 40) score += 30;
                else if (foirUtilization < 50) score += 25;
                else if (foirUtilization < 60) score += 15;
                else score += 5;
                // LTV component (25%)
                const actualLTV = eligibleLoan / propValue * 100;
                if (actualLTV < 70) score += 25;
                else if (actualLTV < 80) score += 20;
                else if (actualLTV < 90) score += 10;
                else score += 5;
                // Credit score component (30%)
                if (creditScore === '750+') score += 30;
                else if (creditScore === '700-749') score += 20;
                else if (creditScore === '650-699') score += 10;
                else score += 3;
                // Age component (15%)
                const age = parseInt(applicantAge);
                if (age >= 25 && age <= 40) score += 15;
                else if (age >= 41 && age <= 50) score += 12;
                else if (age >= 51 && age <= 55) score += 8;
                else score += 3;
                return Math.min(Math.round(score), 100);
            })(),
            bankType: bankType
        });
    };
    const formatCurrency = (value)=>{
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };
    const formatLakhs = (value)=>{
        const lakhs = value / 100000;
        return `₹${lakhs.toFixed(2)}L`;
    };
    const handleReset = ()=>{
        setAnnualIncome(1200000);
        setSpouseIncome(0);
        setOtherIncome(0);
        setApplicantAge(35);
        setEmploymentType('salaried');
        setCreditScore('750+');
        setPropertyType('ready');
        setHousingCategory('non-affordable');
        setBankType('private');
        setExistingEMI(15000);
        setInterestRate(8.5);
        setLoanTenure(20);
        setPropertyValue(5000000);
        setFoir(50);
        setLtv(80);
        setIncludeCharges(true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SEO, {
                title: "India Home Loan Affordability Calculator | Check Eligibility | VegaKash",
                description: "Calculate your home loan eligibility in India. Free calculator with FOIR, LTV, processing fees, stamp duty, and GST. Check how much home loan you can get instantly.",
                keywords: "home loan calculator india, home loan eligibility, loan affordability india, FOIR calculator, LTV calculator, home loan EMI india",
                canonical: "/india/calculators/home-loan-affordability"
            }, void 0, false, {
                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                lineNumber: 368,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "calculator-container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Breadcrumb, {
                        items: breadcrumbItems
                    }, void 0, false, {
                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                        lineNumber: 376,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "calculator-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: "🏠 India Home Loan Affordability Calculator"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                lineNumber: 379,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Calculate your home loan eligibility based on income, FOIR, and LTV norms as per Indian banking guidelines"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                lineNumber: 380,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                        lineNumber: 378,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "calculator-content",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "calculator-main-grid",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "calculator-inputs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Annual Income (Primary)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 389,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: formatCurrency(annualIncome),
                                                            onChange: (e)=>{
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                if (val === '') {
                                                                    setAnnualIncome('');
                                                                    return;
                                                                }
                                                                const num = parseInt(val);
                                                                if (!isNaN(num)) {
                                                                    setAnnualIncome(num);
                                                                }
                                                            },
                                                            onBlur: (e)=>{
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                const num = parseInt(val);
                                                                if (val === '' || isNaN(num)) {
                                                                    setAnnualIncome(1200000);
                                                                } else if (num < 300000) {
                                                                    setAnnualIncome(300000);
                                                                } else if (num > 50000000) {
                                                                    setAnnualIncome(50000000);
                                                                } else {
                                                                    setAnnualIncome(num);
                                                                }
                                                            },
                                                            className: "input-display"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 390,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 388,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: "300000",
                                                    max: "50000000",
                                                    step: "100000",
                                                    value: annualIncome,
                                                    onChange: (e)=>setAnnualIncome(parseFloat(e.target.value)),
                                                    className: "slider"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 420,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-labels",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "₹3L"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 430,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "₹5Cr"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 431,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 429,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 387,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Co-Applicant Income (Optional)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 438,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: spouseIncome > 0 ? formatCurrency(spouseIncome) : '₹0',
                                                            onChange: (e)=>{
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                if (val === '') {
                                                                    setSpouseIncome('');
                                                                    return;
                                                                }
                                                                const num = parseInt(val);
                                                                if (!isNaN(num)) {
                                                                    setSpouseIncome(num);
                                                                }
                                                            },
                                                            onBlur: (e)=>{
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                const num = parseInt(val);
                                                                if (val === '' || isNaN(num)) {
                                                                    setSpouseIncome(0);
                                                                } else if (num < 0) {
                                                                    setSpouseIncome(0);
                                                                } else if (num > 50000000) {
                                                                    setSpouseIncome(50000000);
                                                                } else {
                                                                    setSpouseIncome(num);
                                                                }
                                                            },
                                                            className: "input-display"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 439,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 437,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: "0",
                                                    max: "50000000",
                                                    step: "100000",
                                                    value: spouseIncome,
                                                    onChange: (e)=>setSpouseIncome(parseFloat(e.target.value)),
                                                    className: "slider"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 469,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-labels",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "₹0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 479,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "₹5Cr"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 480,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 478,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 436,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Other Income (Rental, etc.)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 487,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: otherIncome > 0 ? formatCurrency(otherIncome) : '₹0',
                                                            onChange: (e)=>{
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                if (val === '') {
                                                                    setOtherIncome('');
                                                                    return;
                                                                }
                                                                const num = parseInt(val);
                                                                if (!isNaN(num)) {
                                                                    setOtherIncome(num);
                                                                }
                                                            },
                                                            onBlur: (e)=>{
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                const num = parseInt(val);
                                                                if (val === '' || isNaN(num)) {
                                                                    setOtherIncome(0);
                                                                } else if (num < 0) {
                                                                    setOtherIncome(0);
                                                                } else if (num > 10000000) {
                                                                    setOtherIncome(10000000);
                                                                } else {
                                                                    setOtherIncome(num);
                                                                }
                                                            },
                                                            className: "input-display"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 488,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 486,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: "0",
                                                    max: "10000000",
                                                    step: "50000",
                                                    value: otherIncome,
                                                    onChange: (e)=>setOtherIncome(parseFloat(e.target.value)),
                                                    className: "slider"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 518,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-labels",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "₹0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 528,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "₹1Cr"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 529,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 527,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 485,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                padding: '0.75rem',
                                                background: 'rgba(59, 130, 246, 0.05)',
                                                borderRadius: '6px',
                                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                                marginBottom: '1rem',
                                                fontSize: '0.85rem',
                                                color: '#1e40af'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "ℹ️ Income Weightage Applied:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 543,
                                                    columnNumber: 17
                                                }, this),
                                                " Co-applicant (75%), Other income (60%) as per banking norms"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 534,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Your Current Age"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 549,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: `${applicantAge} Years`,
                                                            onChange: (e)=>{
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                if (val === '') {
                                                                    setApplicantAge('');
                                                                    return;
                                                                }
                                                                const num = parseInt(val);
                                                                if (!isNaN(num)) {
                                                                    setApplicantAge(num);
                                                                }
                                                            },
                                                            onBlur: (e)=>{
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                const num = parseInt(val);
                                                                if (val === '' || isNaN(num)) {
                                                                    setApplicantAge(35);
                                                                } else if (num < 21) {
                                                                    setApplicantAge(21);
                                                                } else if (num > 65) {
                                                                    setApplicantAge(65);
                                                                } else {
                                                                    setApplicantAge(num);
                                                                }
                                                            },
                                                            className: "input-display"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 550,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 548,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: "21",
                                                    max: "65",
                                                    step: "1",
                                                    value: applicantAge,
                                                    onChange: (e)=>setApplicantAge(parseFloat(e.target.value)),
                                                    className: "slider"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 580,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-labels",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "21 Yrs"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 590,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "65 Yrs"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 591,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 589,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 547,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        fontWeight: '600',
                                                        color: '#334155',
                                                        marginBottom: '0.75rem',
                                                        display: 'block',
                                                        fontSize: '0.95rem'
                                                    },
                                                    children: "Employment Type"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 597,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: employmentType,
                                                    onChange: (e)=>setEmploymentType(e.target.value),
                                                    className: "input-display",
                                                    style: dropdownStyle,
                                                    onMouseEnter: (e)=>{
                                                        Object.assign(e.target.style, dropdownHoverStyle);
                                                    },
                                                    onMouseLeave: (e)=>{
                                                        e.target.style.borderColor = '#e2e8f0';
                                                        e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
                                                        e.target.style.transform = 'translateY(0)';
                                                    },
                                                    onFocus: (e)=>{
                                                        Object.assign(e.target.style, dropdownFocusStyle);
                                                    },
                                                    onBlur: (e)=>{
                                                        e.target.style.borderColor = '#e2e8f0';
                                                        e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "salaried",
                                                            style: {
                                                                padding: '1rem',
                                                                fontSize: '1rem',
                                                                fontWeight: '600',
                                                                background: '#fff'
                                                            },
                                                            children: "💼 Salaried (Retire at 60)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 619,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "self-employed",
                                                            style: {
                                                                padding: '1rem',
                                                                fontSize: '1rem',
                                                                fontWeight: '600',
                                                                background: '#fff'
                                                            },
                                                            children: "🏢 Self-Employed (Retire at 65)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 620,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 598,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 596,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        fontWeight: '600',
                                                        color: '#334155',
                                                        marginBottom: '0.75rem',
                                                        display: 'block',
                                                        fontSize: '0.95rem'
                                                    },
                                                    children: "CIBIL Score"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 626,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: creditScore,
                                                    onChange: (e)=>setCreditScore(e.target.value),
                                                    className: "input-display",
                                                    style: dropdownStyle,
                                                    onMouseEnter: (e)=>{
                                                        Object.assign(e.target.style, dropdownHoverStyle);
                                                    },
                                                    onMouseLeave: (e)=>{
                                                        e.target.style.borderColor = '#e2e8f0';
                                                        e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
                                                        e.target.style.transform = 'translateY(0)';
                                                    },
                                                    onFocus: (e)=>{
                                                        Object.assign(e.target.style, dropdownFocusStyle);
                                                    },
                                                    onBlur: (e)=>{
                                                        e.target.style.borderColor = '#e2e8f0';
                                                        e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "750+",
                                                            style: {
                                                                padding: '1rem',
                                                                fontSize: '1rem',
                                                                fontWeight: '600',
                                                                background: '#fff'
                                                            },
                                                            children: "🌟 750+ (Best Rates)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 648,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "700-749",
                                                            style: {
                                                                padding: '1rem',
                                                                fontSize: '1rem',
                                                                fontWeight: '600',
                                                                background: '#fff'
                                                            },
                                                            children: "🟢 700-749 (+0.25% rate)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 649,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "650-699",
                                                            style: {
                                                                padding: '1rem',
                                                                fontSize: '1rem',
                                                                fontWeight: '600',
                                                                background: '#fff'
                                                            },
                                                            children: "🟡 650-699 (+0.75% rate)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 650,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "below-650",
                                                            style: {
                                                                padding: '1rem',
                                                                fontSize: '1rem',
                                                                fontWeight: '600',
                                                                background: '#fff'
                                                            },
                                                            children: "🔴 Below 650 (+1.5% rate)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 651,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 627,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 625,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        fontWeight: '600',
                                                        color: '#334155',
                                                        marginBottom: '0.75rem',
                                                        display: 'block',
                                                        fontSize: '0.95rem'
                                                    },
                                                    children: "Property Type"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 657,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: propertyType,
                                                    onChange: (e)=>setPropertyType(e.target.value),
                                                    className: "input-display",
                                                    style: {
                                                        width: '100%',
                                                        padding: '1rem 1.25rem',
                                                        fontSize: '1rem',
                                                        background: 'white',
                                                        border: '2px solid #cbd5e1',
                                                        borderRadius: '10px',
                                                        fontWeight: '600',
                                                        color: '#1e293b',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        appearance: 'none',
                                                        WebkitAppearance: 'none',
                                                        MozAppearance: 'none',
                                                        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23667eea\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'right 1rem center',
                                                        backgroundSize: '24px',
                                                        paddingRight: '3rem',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                        outline: 'none'
                                                    },
                                                    onMouseEnter: (e)=>{
                                                        e.target.style.borderColor = '#667eea';
                                                        e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                                                    },
                                                    onMouseLeave: (e)=>{
                                                        e.target.style.borderColor = '#cbd5e1';
                                                        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                                    },
                                                    onFocus: (e)=>{
                                                        e.target.style.borderColor = '#667eea';
                                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                                    },
                                                    onBlur: (e)=>{
                                                        e.target.style.borderColor = '#cbd5e1';
                                                        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "ready",
                                                            style: {
                                                                padding: '1rem',
                                                                fontSize: '1rem',
                                                                fontWeight: '600'
                                                            },
                                                            children: "✅ Ready-to-Move"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 701,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "under-construction",
                                                            style: {
                                                                padding: '1rem',
                                                                fontSize: '1rem',
                                                                fontWeight: '600'
                                                            },
                                                            children: "🏭 Under Construction"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 702,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 658,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 656,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: '1.5rem'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        display: 'block',
                                                        marginBottom: '0.5rem',
                                                        fontWeight: 'bold',
                                                        color: '#334155',
                                                        fontSize: '1rem'
                                                    },
                                                    children: "🏦 Preferred Lender Type"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 708,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: bankType,
                                                    onChange: (e)=>setBankType(e.target.value),
                                                    style: dropdownStyle,
                                                    onMouseEnter: (e)=>Object.assign(e.target.style, dropdownHoverStyle),
                                                    onMouseLeave: (e)=>Object.assign(e.target.style, dropdownStyle),
                                                    onFocus: (e)=>Object.assign(e.target.style, dropdownFocusStyle),
                                                    onBlur: (e)=>Object.assign(e.target.style, dropdownStyle),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "psu",
                                                            style: {
                                                                padding: '0.5rem',
                                                                background: '#fff'
                                                            },
                                                            children: "PSU Bank (Conservative, Max FOIR 55%)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 720,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "private",
                                                            style: {
                                                                padding: '0.5rem',
                                                                background: '#fff'
                                                            },
                                                            children: "Private Bank (Balanced, Max FOIR 60%)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 721,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "nbfc",
                                                            style: {
                                                                padding: '0.5rem',
                                                                background: '#fff'
                                                            },
                                                            children: "NBFC (Flexible, Max FOIR 65%)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 722,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 711,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: '0.85rem',
                                                        color: '#64748b',
                                                        marginTop: '0.5rem'
                                                    },
                                                    children: "💡 Different lenders have varying FOIR limits and approval criteria"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 724,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 707,
                                            columnNumber: 15
                                        }, this),
                                        propertyType === 'under-construction' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "slider-header",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            fontWeight: '600',
                                                            color: '#334155',
                                                            marginBottom: '0.5rem',
                                                            display: 'block',
                                                            fontSize: '0.95rem'
                                                        },
                                                        children: "Housing Category"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 733,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: housingCategory,
                                                        onChange: (e)=>setHousingCategory(e.target.value),
                                                        className: "input-display",
                                                        style: dropdownStyle,
                                                        onMouseEnter: (e)=>{
                                                            Object.assign(e.target.style, dropdownHoverStyle);
                                                        },
                                                        onMouseLeave: (e)=>{
                                                            e.target.style.borderColor = '#e2e8f0';
                                                            e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
                                                            e.target.style.transform = 'translateY(0)';
                                                        },
                                                        onFocus: (e)=>{
                                                            Object.assign(e.target.style, dropdownFocusStyle);
                                                        },
                                                        onBlur: (e)=>{
                                                            e.target.style.borderColor = '#e2e8f0';
                                                            e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "affordable",
                                                                style: {
                                                                    padding: '1rem',
                                                                    fontSize: '1rem',
                                                                    fontWeight: '600',
                                                                    background: '#fff'
                                                                },
                                                                children: "🏘️ Affordable (1% GST)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                lineNumber: 755,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "non-affordable",
                                                                style: {
                                                                    padding: '1rem',
                                                                    fontSize: '1rem',
                                                                    fontWeight: '600',
                                                                    background: '#fff'
                                                                },
                                                                children: "🏛️ Non-Affordable (5% GST)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                lineNumber: 756,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 734,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 732,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 731,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Existing Monthly EMI"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 765,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: formatCurrency(existingEMI),
                                                            onChange: (e)=>{
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                if (val === '') {
                                                                    setExistingEMI('');
                                                                    return;
                                                                }
                                                                const num = parseInt(val);
                                                                if (!isNaN(num)) {
                                                                    setExistingEMI(num);
                                                                }
                                                            },
                                                            onBlur: (e)=>{
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                const num = parseInt(val);
                                                                if (val === '' || isNaN(num)) {
                                                                    setExistingEMI(15000);
                                                                } else if (num < 0) {
                                                                    setExistingEMI(0);
                                                                } else if (num > 500000) {
                                                                    setExistingEMI(500000);
                                                                } else {
                                                                    setExistingEMI(num);
                                                                }
                                                            },
                                                            className: "input-display"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 766,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 764,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: "0",
                                                    max: "500000",
                                                    step: "5000",
                                                    value: existingEMI,
                                                    onChange: (e)=>setExistingEMI(parseFloat(e.target.value)),
                                                    className: "slider"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 796,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-labels",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "₹0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 806,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "₹5L"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 807,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 805,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 763,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Desired Property Value"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 814,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: formatCurrency(propertyValue),
                                                            onChange: (e)=>{
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                if (val === '') {
                                                                    setPropertyValue('');
                                                                    return;
                                                                }
                                                                const num = parseInt(val);
                                                                if (!isNaN(num)) {
                                                                    setPropertyValue(num);
                                                                }
                                                            },
                                                            onBlur: (e)=>{
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                const num = parseInt(val);
                                                                if (val === '' || isNaN(num)) {
                                                                    setPropertyValue(5000000);
                                                                } else if (num < 1000000) {
                                                                    setPropertyValue(1000000);
                                                                } else if (num > 100000000) {
                                                                    setPropertyValue(100000000);
                                                                } else {
                                                                    setPropertyValue(num);
                                                                }
                                                            },
                                                            className: "input-display"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 815,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 813,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: "1000000",
                                                    max: "100000000",
                                                    step: "500000",
                                                    value: propertyValue,
                                                    onChange: (e)=>setPropertyValue(parseFloat(e.target.value)),
                                                    className: "slider"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 845,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-labels",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "₹10L"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 855,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "₹10Cr"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 856,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 854,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 812,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Interest Rate (p.a.)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 863,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: `${interestRate}%`,
                                                            onChange: (e)=>{
                                                                const val = e.target.value.replace(/[%\s]/g, '');
                                                                if (val === '') {
                                                                    setInterestRate('');
                                                                    return;
                                                                }
                                                                const num = parseFloat(val);
                                                                if (!isNaN(num)) {
                                                                    setInterestRate(num);
                                                                }
                                                            },
                                                            onBlur: (e)=>{
                                                                const val = e.target.value.replace(/[%\s]/g, '');
                                                                const num = parseFloat(val);
                                                                if (val === '' || isNaN(num)) {
                                                                    setInterestRate(8.5);
                                                                } else if (num < 6) {
                                                                    setInterestRate(6);
                                                                } else if (num > 15) {
                                                                    setInterestRate(15);
                                                                } else {
                                                                    setInterestRate(num);
                                                                }
                                                            },
                                                            className: "input-display"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 864,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 862,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: "6",
                                                    max: "15",
                                                    step: "0.1",
                                                    value: interestRate,
                                                    onChange: (e)=>setInterestRate(parseFloat(e.target.value)),
                                                    className: "slider"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 894,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-labels",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "6%"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 904,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "15%"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 905,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 903,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 861,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Loan Tenure"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 912,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: `${loanTenure} Years`,
                                                            onChange: (e)=>{
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                if (val === '') {
                                                                    setLoanTenure('');
                                                                    return;
                                                                }
                                                                const num = parseInt(val);
                                                                if (!isNaN(num)) {
                                                                    setLoanTenure(num);
                                                                }
                                                            },
                                                            onBlur: (e)=>{
                                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                                const num = parseInt(val);
                                                                if (val === '' || isNaN(num)) {
                                                                    setLoanTenure(20);
                                                                } else if (num < 5) {
                                                                    setLoanTenure(5);
                                                                } else if (num > 30) {
                                                                    setLoanTenure(30);
                                                                } else {
                                                                    setLoanTenure(num);
                                                                }
                                                            },
                                                            className: "input-display"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 913,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 911,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: "5",
                                                    max: "30",
                                                    step: "1",
                                                    value: loanTenure,
                                                    onChange: (e)=>setLoanTenure(parseFloat(e.target.value)),
                                                    className: "slider"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 943,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-labels",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "5 Yrs"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 953,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "30 Yrs"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 954,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 952,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 910,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "FOIR Limit (%)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 961,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: `${foir}%`,
                                                            onChange: (e)=>{
                                                                const val = e.target.value.replace(/[%\s]/g, '');
                                                                if (val === '') {
                                                                    setFoir('');
                                                                    return;
                                                                }
                                                                const num = parseFloat(val);
                                                                if (!isNaN(num)) {
                                                                    setFoir(num);
                                                                }
                                                            },
                                                            onBlur: (e)=>{
                                                                const val = e.target.value.replace(/[%\s]/g, '');
                                                                const num = parseFloat(val);
                                                                if (val === '' || isNaN(num)) {
                                                                    setFoir(50);
                                                                } else if (num < 30) {
                                                                    setFoir(30);
                                                                } else if (num > 70) {
                                                                    setFoir(70);
                                                                } else {
                                                                    setFoir(num);
                                                                }
                                                            },
                                                            className: "input-display"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 962,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 960,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: "30",
                                                    max: "70",
                                                    step: "5",
                                                    value: foir,
                                                    onChange: (e)=>setFoir(parseFloat(e.target.value)),
                                                    className: "slider"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 992,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-labels",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "30%"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1002,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "70%"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1003,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1001,
                                                    columnNumber: 17
                                                }, this),
                                                foir > 60 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        marginTop: '0.5rem',
                                                        padding: '0.5rem',
                                                        background: foir > 65 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                                                        borderRadius: '6px',
                                                        border: `1px solid ${foir > 65 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`,
                                                        fontSize: '0.85rem',
                                                        color: foir > 65 ? '#dc2626' : '#d97706'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: [
                                                                "⚠️ ",
                                                                foir > 65 ? 'Very Low Approval Probability' : 'Aggressive FOIR'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1015,
                                                            columnNumber: 21
                                                        }, this),
                                                        " - Most banks approve 50-60% only"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1006,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 959,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Max LTV Ratio (%)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1023,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: `${ltv}%`,
                                                            onChange: (e)=>{
                                                                const val = e.target.value.replace(/[%\s]/g, '');
                                                                if (val === '') {
                                                                    setLtv('');
                                                                    return;
                                                                }
                                                                const num = parseFloat(val);
                                                                if (!isNaN(num)) {
                                                                    setLtv(num);
                                                                }
                                                            },
                                                            onBlur: (e)=>{
                                                                const val = e.target.value.replace(/[%\s]/g, '');
                                                                const num = parseFloat(val);
                                                                if (val === '' || isNaN(num)) {
                                                                    setLtv(80);
                                                                } else if (num < 50) {
                                                                    setLtv(50);
                                                                } else if (num > 90) {
                                                                    setLtv(90);
                                                                } else {
                                                                    setLtv(num);
                                                                }
                                                            },
                                                            className: "input-display"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1024,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1022,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: "50",
                                                    max: "90",
                                                    step: "5",
                                                    value: ltv,
                                                    onChange: (e)=>setLtv(parseFloat(e.target.value)),
                                                    className: "slider"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1054,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "slider-labels",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "50%"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1064,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "90%"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1065,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1063,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 1021,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: '1rem',
                                                marginBottom: '1rem'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    cursor: 'pointer'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: includeCharges,
                                                        onChange: (e)=>setIncludeCharges(e.target.checked),
                                                        style: {
                                                            width: '18px',
                                                            height: '18px',
                                                            cursor: 'pointer'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1072,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: '0.95rem',
                                                            fontWeight: '500'
                                                        },
                                                        children: "Include Processing & Registration Charges"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1078,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1071,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 1070,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'center',
                                                marginTop: '1.5rem'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleReset,
                                                className: "btn-reset",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "16",
                                                        height: "16",
                                                        viewBox: "0 0 16 16",
                                                        fill: "none",
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.84871 2 11.5151 2.87161 12.6 4.2M12.6 4.2V1M12.6 4.2H9.4",
                                                            stroke: "currentColor",
                                                            strokeWidth: "1.5",
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1085,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1084,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Reset to Default"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1083,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 1082,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                    lineNumber: 385,
                                    columnNumber: 13
                                }, this),
                                result && result.eligible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "calculator-results",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: "Your Home Loan Eligibility"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 1094,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                                padding: '1.5rem',
                                                borderRadius: '12px',
                                                marginBottom: '2rem',
                                                border: '2px solid #bae6fd',
                                                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.1)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: '1rem'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            style: {
                                                                margin: 0,
                                                                fontSize: '1.2rem',
                                                                color: '#0c4a6e',
                                                                fontWeight: '700'
                                                            },
                                                            children: "🎯 Approval Probability"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1111,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: '2rem',
                                                                fontWeight: '800',
                                                                color: result.approvalProbability >= 70 ? '#15803d' : result.approvalProbability >= 50 ? '#ca8a04' : '#dc2626'
                                                            },
                                                            children: [
                                                                result.approvalProbability,
                                                                "%"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1119,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1105,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        width: '100%',
                                                        height: '24px',
                                                        background: '#e2e8f0',
                                                        borderRadius: '12px',
                                                        overflow: 'hidden',
                                                        position: 'relative'
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: `${result.approvalProbability}%`,
                                                            height: '100%',
                                                            background: result.approvalProbability >= 70 ? 'linear-gradient(90deg, #22c55e 0%, #15803d 100%)' : result.approvalProbability >= 50 ? 'linear-gradient(90deg, #facc15 0%, #ca8a04 100%)' : 'linear-gradient(90deg, #f87171 0%, #dc2626 100%)',
                                                            transition: 'width 0.6s ease-out',
                                                            borderRadius: '12px',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1135,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1127,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        marginTop: '0.75rem',
                                                        fontSize: '0.9rem',
                                                        color: '#475569',
                                                        margin: '0.75rem 0 0 0'
                                                    },
                                                    children: [
                                                        result.approvalProbability >= 70 && '🟢 High - Strong approval chances with most lenders',
                                                        result.approvalProbability >= 50 && result.approvalProbability < 70 && '🟡 Moderate - Consider improving credit score or reducing EMI obligations',
                                                        result.approvalProbability < 50 && '🔴 Low - May need co-applicant or higher down payment'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1148,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 1097,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "result-cards",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "result-card highlight",
                                                    style: {
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        color: 'white',
                                                        padding: '2rem 1.5rem',
                                                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                                                        border: 'none'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "result-label",
                                                            style: {
                                                                color: 'rgba(255, 255, 255, 0.9)',
                                                                fontSize: '0.95rem',
                                                                fontWeight: '500',
                                                                marginBottom: '0.75rem',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            },
                                                            children: "✨ Eligible Loan Amount"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1168,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "result-value",
                                                            style: {
                                                                fontSize: '3.5rem',
                                                                fontWeight: '800',
                                                                color: 'white',
                                                                marginBottom: '0.5rem',
                                                                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                                                lineHeight: '1.1'
                                                            },
                                                            children: formatCurrency(result.eligibleLoan)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1176,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: '1.1rem',
                                                                color: 'rgba(255, 255, 255, 0.95)',
                                                                marginTop: '0.5rem',
                                                                fontWeight: '600',
                                                                background: 'rgba(255, 255, 255, 0.15)',
                                                                padding: '0.4rem 0.8rem',
                                                                borderRadius: '20px',
                                                                display: 'inline-block'
                                                            },
                                                            children: formatLakhs(result.eligibleLoan)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1184,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1161,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "result-card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "result-label",
                                                            children: "Monthly EMI"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1199,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "result-value",
                                                            children: formatCurrency(result.monthlyEMI)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1200,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1198,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "result-card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "result-label",
                                                            children: "Down Payment Required"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1204,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "result-value",
                                                            children: formatCurrency(result.downPayment)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1205,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: '0.85rem',
                                                                color: '#666',
                                                                marginTop: '0.5rem'
                                                            },
                                                            children: formatLakhs(result.downPayment)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1206,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1203,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "result-card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "result-label",
                                                            children: "LTV Used"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1212,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "result-value",
                                                            children: [
                                                                result.ltvUsed,
                                                                "%"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1213,
                                                            columnNumber: 21
                                                        }, this),
                                                        result.effectiveLTV < result.ltvUsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: '0.75rem',
                                                                color: '#f59e0b',
                                                                marginTop: '0.25rem'
                                                            },
                                                            children: [
                                                                "RBI Max: ",
                                                                result.rbiMaxLTV,
                                                                "%"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1215,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1211,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "result-card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "result-label",
                                                            children: "Loan Tenure"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1222,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "result-value",
                                                            children: [
                                                                result.effectiveTenure,
                                                                " Yrs"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1223,
                                                            columnNumber: 21
                                                        }, this),
                                                        result.tenureCapped && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: '0.75rem',
                                                                color: '#f59e0b',
                                                                marginTop: '0.25rem'
                                                            },
                                                            children: "Capped by age"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1225,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1221,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "result-card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "result-label",
                                                            children: "FOIR Utilization"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1232,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "result-value",
                                                            children: [
                                                                result.foirUtilization,
                                                                "%"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1233,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1231,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "result-card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "result-label",
                                                            children: "Income Multiplier"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1237,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "result-value",
                                                            children: [
                                                                result.incomeMultiplier,
                                                                "x"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1238,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: '0.75rem',
                                                                color: '#666',
                                                                marginTop: '0.25rem'
                                                            },
                                                            children: [
                                                                "Typical: ",
                                                                result.typicalMultiplierMin,
                                                                "x - ",
                                                                result.typicalMultiplierMax,
                                                                "x"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1239,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1236,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 1160,
                                            columnNumber: 17
                                        }, this),
                                        result.creditScore !== '750+' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: '1.5rem',
                                                padding: '1rem',
                                                background: 'rgba(239, 68, 68, 0.05)',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(239, 68, 68, 0.2)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    style: {
                                                        fontSize: '1rem',
                                                        marginBottom: '0.5rem',
                                                        color: '#dc2626'
                                                    },
                                                    children: "📊 Credit Score Impact"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1254,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: '0.9rem',
                                                        marginBottom: '0.5rem'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Effective Interest Rate:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1258,
                                                            columnNumber: 23
                                                        }, this),
                                                        " ",
                                                        result.effectiveInterestRate,
                                                        "% (base ",
                                                        interestRate,
                                                        "% + premium)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1257,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: '0.85rem',
                                                        color: '#666',
                                                        margin: 0
                                                    },
                                                    children: (()=>{
                                                        const baseRate = interestRate / 100 / 12;
                                                        const adjustedRate = parseFloat(result.effectiveInterestRate) / 100 / 12;
                                                        const n = result.effectiveTenure * 12;
                                                        const baseEMI = result.eligibleLoan * baseRate * Math.pow(1 + baseRate, n) / (Math.pow(1 + baseRate, n) - 1);
                                                        const adjustedEMI = result.eligibleLoan * adjustedRate * Math.pow(1 + adjustedRate, n) / (Math.pow(1 + adjustedRate, n) - 1);
                                                        const monthlySavings = Math.round(adjustedEMI - baseEMI);
                                                        const yearlySavings = monthlySavings * 12;
                                                        return `Improving your CIBIL score to 750+ could reduce your EMI by approx ₹${monthlySavings.toLocaleString('en-IN')}/month (₹${yearlySavings.toLocaleString('en-IN')}/year)`;
                                                    })()
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1260,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 1247,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: '1.5rem',
                                                padding: '1rem',
                                                background: result.limitingFactor === 'FOIR' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                borderRadius: '8px',
                                                border: `1px solid ${result.limitingFactor === 'FOIR' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    style: {
                                                        fontSize: '1rem',
                                                        marginBottom: '0.75rem',
                                                        color: result.limitingFactor === 'FOIR' ? '#d97706' : '#2563eb'
                                                    },
                                                    children: "📊 Eligibility Analysis"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1283,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: '0.95rem',
                                                        marginBottom: '0.5rem'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Limiting Factor:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1287,
                                                            columnNumber: 21
                                                        }, this),
                                                        " ",
                                                        result.limitingFactor === 'FOIR' ? 'FOIR (Income-based)' : 'LTV (Property Value-based)'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1286,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: '0.9rem',
                                                        color: '#666'
                                                    },
                                                    children: result.limitingFactor === 'FOIR' ? 'Your loan amount is limited by your income and FOIR. Increase income or reduce existing EMI to get higher loan amount.' : 'Your loan amount is limited by property value and LTV ratio. You have good income capacity for higher loan.'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1289,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 1276,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "breakdown-chart",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    children: "Loan Breakdown"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1298,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "chart-bar",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "chart-segment principal",
                                                            style: {
                                                                width: `${(result.eligibleLoan / (result.eligibleLoan + result.totalInterest) * 100).toFixed(1)}%`
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Principal"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                lineNumber: 1304,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1300,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "chart-segment interest",
                                                            style: {
                                                                width: `${(result.totalInterest / (result.eligibleLoan + result.totalInterest) * 100).toFixed(1)}%`
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Interest"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                lineNumber: 1310,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1306,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1299,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "chart-legend",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "legend-item",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "legend-color principal"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1315,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: [
                                                                        "Principal: ",
                                                                        formatCurrency(result.eligibleLoan)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1316,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1314,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "legend-item",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "legend-color interest"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1319,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: [
                                                                        "Interest: ",
                                                                        formatCurrency(result.totalInterest)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1320,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1318,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "legend-item",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "legend-color",
                                                                    style: {
                                                                        background: '#10b981'
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1323,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: [
                                                                        "Total Payable: ",
                                                                        formatCurrency(result.totalAmountPayable)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1324,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1322,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1313,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 1297,
                                            columnNumber: 17
                                        }, this),
                                        includeCharges && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: '1.5rem',
                                                padding: '1rem',
                                                background: 'rgba(239, 68, 68, 0.05)',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(239, 68, 68, 0.1)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    style: {
                                                        fontSize: '1rem',
                                                        marginBottom: '1rem',
                                                        color: '#dc2626'
                                                    },
                                                    children: "💰 Upfront Costs Summary"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1338,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'grid',
                                                        gap: '0.75rem'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                padding: '0.5rem 0',
                                                                borderBottom: '1px solid rgba(0,0,0,0.1)'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Down Payment"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1343,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: formatCurrency(result.downPayment)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1344,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1342,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                padding: '0.5rem 0',
                                                                borderBottom: '1px solid rgba(0,0,0,0.1)'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Processing Fee (0.5%)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1347,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: formatCurrency(result.processingFee)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1348,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1346,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                padding: '0.5rem 0',
                                                                borderBottom: '1px solid rgba(0,0,0,0.1)'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Stamp Duty & Registration (~6%)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1351,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: formatCurrency(result.stampDutyAndRegistration)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1352,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1350,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                padding: '0.5rem 0',
                                                                borderBottom: '1px solid rgba(0,0,0,0.1)'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "GST (if applicable, ~1%)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1355,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: formatCurrency(result.gst)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1356,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1354,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                padding: '0.5rem 0',
                                                                borderBottom: '1px solid rgba(0,0,0,0.1)'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Legal & Documentation Charges"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1359,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: formatCurrency(result.legalCharges)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1360,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1358,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                padding: '0.75rem 0',
                                                                marginTop: '0.5rem',
                                                                fontSize: '1.1rem',
                                                                fontWeight: '700',
                                                                color: '#dc2626'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Total Upfront Cost"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1363,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: formatCurrency(result.totalUpfrontCost)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                                    lineNumber: 1364,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1362,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1341,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 1331,
                                            columnNumber: 19
                                        }, this),
                                        result.foirUtilization > 60 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "alert alert-warning",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "20",
                                                    height: "20",
                                                    viewBox: "0 0 20 20",
                                                    fill: "none",
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z",
                                                        stroke: "currentColor",
                                                        strokeWidth: "2",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1374,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1373,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "High FOIR Utilization"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1377,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                "Your FOIR is ",
                                                                result.foirUtilization,
                                                                "%. Most banks prefer FOIR below 50-60%. Consider reducing existing EMI or increasing income."
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1378,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1376,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 1372,
                                            columnNumber: 19
                                        }, this),
                                        result.ltvUsed > 85 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "alert alert-info",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "20",
                                                    height: "20",
                                                    viewBox: "0 0 20 20",
                                                    fill: "none",
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M10 11V15M10 7H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z",
                                                        stroke: "currentColor",
                                                        strokeWidth: "2",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1386,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1385,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "High LTV Ratio"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1389,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                "Your LTV is ",
                                                                result.ltvUsed,
                                                                "%. Some banks may require additional documentation or charge higher interest rates for LTV above 80%."
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                            lineNumber: 1390,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1388,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 1384,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                    lineNumber: 1093,
                                    columnNumber: 15
                                }, this),
                                result && !result.eligible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "calculator-results",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "alert alert-warning",
                                        style: {
                                            marginTop: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "20",
                                                height: "20",
                                                viewBox: "0 0 20 20",
                                                fill: "none",
                                                xmlns: "http://www.w3.org/2000/svg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z",
                                                    stroke: "currentColor",
                                                    strokeWidth: "2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                    lineNumber: 1401,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1400,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Not Eligible"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1404,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: result.message
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1405,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1403,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1399,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                    lineNumber: 1398,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                            lineNumber: 384,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                        lineNumber: 383,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            margin: '2rem 0',
                            padding: '1.25rem',
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%)',
                            borderRadius: '12px',
                            border: '2px solid rgba(239, 68, 68, 0.2)',
                            borderLeft: '6px solid #dc2626'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontSize: '1.1rem',
                                    marginBottom: '0.75rem',
                                    color: '#dc2626',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "24",
                                        height: "24",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        xmlns: "http://www.w3.org/2000/svg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                            lineNumber: 1431,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1430,
                                        columnNumber: 13
                                    }, this),
                                    "Important Disclaimer"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                lineNumber: 1422,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    margin: 0,
                                    color: '#374151'
                                },
                                children: [
                                    "This calculator provides ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "indicative eligibility"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1436,
                                        columnNumber: 38
                                    }, this),
                                    " based on general Indian banking norms. Final loan approval, FOIR, LTV ratio, interest rate, processing charges, and tenure ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "may vary significantly"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1437,
                                        columnNumber: 97
                                    }, this),
                                    " by:"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                lineNumber: 1435,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                style: {
                                    marginTop: '0.75rem',
                                    marginBottom: 0,
                                    paddingLeft: '1.5rem',
                                    color: '#374151'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Bank or NBFC policy (PSU banks, private banks, housing finance companies)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1440,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Applicant’s credit score (CIBIL 750+ gets better terms)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1441,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Employment type, stability, and company profile"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1442,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "City/location of property (metro vs tier-2/tier-3 cities)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1443,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Property type (ready vs under-construction, residential vs commercial)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1444,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Existing relationship with the bank (salary account, deposits, etc.)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1445,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                lineNumber: 1439,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '0.9rem',
                                    marginTop: '0.75rem',
                                    marginBottom: 0,
                                    color: '#6b7280',
                                    fontStyle: 'italic'
                                },
                                children: [
                                    "📌 ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Income Weightage:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1448,
                                        columnNumber: 16
                                    }, this),
                                    " Co-applicant income weighted at 75%, rental/other income at 60% as per typical banking practice. Actual weightage may vary."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                lineNumber: 1447,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '0.9rem',
                                    marginTop: '0.5rem',
                                    marginBottom: 0,
                                    color: '#6b7280',
                                    fontStyle: 'italic'
                                },
                                children: [
                                    "📌 ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "RBI LTV Caps:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1451,
                                        columnNumber: 16
                                    }, this),
                                    " ≤₹30L: 90%, ₹30-75L: 80%, >₹75L: 75% — programmatically enforced in this calculator."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                lineNumber: 1450,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                        lineNumber: 1414,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "seo-content-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "content-block",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "How to Calculate Home Loan Eligibility in India"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1458,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Indian banks and NBFCs use two primary criteria to determine your home loan eligibility:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1459,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "FOIR (Fixed Obligation to Income Ratio):"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1463,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Your total monthly EMIs (including the new home loan) should not exceed 50-60% of your gross monthly income."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1463,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "LTV (Loan-to-Value Ratio):"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1464,
                                                        columnNumber: 19
                                                    }, this),
                                                    " As per RBI guidelines, banks can lend up to 75-90% of the property value depending on the loan amount."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1464,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1462,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "formula-box",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Max EMI = (Monthly Income × FOIR%) - Existing EMIs"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1467,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1467,
                                                columnNumber: 82
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Max Loan by LTV = Property Value × LTV%"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1468,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1466,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Your actual eligible loan will be the lower of these two amounts."
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1470,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                lineNumber: 1457,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "content-block",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Understanding Home Loan Eligibility Criteria in India"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1474,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "1. FOIR (Fixed Obligation to Income Ratio)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1476,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "FOIR is the percentage of your monthly income that goes toward EMI payments. Most Indian banks allow FOIR of 50-60%:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1477,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Salaried Employees:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1481,
                                                        columnNumber: 19
                                                    }, this),
                                                    " 50-55% FOIR"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1481,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Self-Employed:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1482,
                                                        columnNumber: 19
                                                    }, this),
                                                    " 50-60% FOIR"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1482,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "High Income (₹10L+ annually):"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1483,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Up to 65% FOIR"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1483,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1480,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "2. LTV (Loan-to-Value) Ratio - RBI Guidelines"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1486,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "RBI mandates maximum LTV ratios based on loan amount:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1487,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Up to ₹30 lakhs:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1489,
                                                        columnNumber: 19
                                                    }, this),
                                                    " 90% LTV (10% down payment)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1489,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "₹30 lakhs - ₹75 lakhs:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1490,
                                                        columnNumber: 19
                                                    }, this),
                                                    " 80% LTV (20% down payment)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1490,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Above ₹75 lakhs:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1491,
                                                        columnNumber: 19
                                                    }, this),
                                                    " 75% LTV (25% down payment)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1491,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1488,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "3. Income Considerations & Weightage"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1494,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Banks apply different weightage to various income sources:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1495,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Primary Income:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1497,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Salary, business income (100% weightage)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1497,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Co-Applicant Income:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1498,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Spouse, parent, or child (50-100% weightage, typically 75%)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1498,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Rental Income:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1499,
                                                        columnNumber: 19
                                                    }, this),
                                                    " From existing properties (50-70% weightage, typically 60%)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1499,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Other Income:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1500,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Investment returns, freelance work (40-60% weightage, case-by-case)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1500,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1496,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            padding: '0.75rem',
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            borderRadius: '6px',
                                            marginTop: '0.75rem',
                                            fontSize: '0.95rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "ℹ️ This calculator applies conservative weightage:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1509,
                                                columnNumber: 15
                                            }, this),
                                            " Co-applicant at 75%, Rental/Other at 60%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1502,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "4. Age Factor"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1512,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Maximum loan tenure is limited by retirement age:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1513,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Salaried:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1517,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Up to 60-65 years of age"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1517,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Self-Employed:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1518,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Up to 65-70 years of age"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1518,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Maximum Tenure:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1519,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Typically 30 years"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1519,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1516,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                lineNumber: 1473,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "content-block",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Home Loan Processing Fees and Charges in India"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1524,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Apart from the loan amount and interest, consider these costs:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1525,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Upfront Costs:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1527,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Processing Fee:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1529,
                                                        columnNumber: 19
                                                    }, this),
                                                    " 0.25% - 1% of loan amount (₹5,000 - ₹50,000 typically)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1529,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Stamp Duty & Registration:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1530,
                                                        columnNumber: 19
                                                    }, this),
                                                    " 5-8% of property value (varies by state)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1530,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "GST on Under-Construction:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1531,
                                                        columnNumber: 19
                                                    }, this),
                                                    " 1% (non-affordable) or 5% (affordable housing)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1531,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Legal & Technical Valuation:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1532,
                                                        columnNumber: 19
                                                    }, this),
                                                    " ₹5,000 - ₹25,000"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1532,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Documentation Charges:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1533,
                                                        columnNumber: 19
                                                    }, this),
                                                    " ₹2,000 - ₹10,000"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1533,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1528,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Ongoing Costs:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1536,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Prepayment Charges:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1538,
                                                        columnNumber: 19
                                                    }, this),
                                                    " 0-3% for fixed-rate loans (nil for floating-rate)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1538,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Late Payment Penalty:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1539,
                                                        columnNumber: 19
                                                    }, this),
                                                    " 2% per month on overdue EMI"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1539,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Conversion Charges:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1540,
                                                        columnNumber: 19
                                                    }, this),
                                                    " ₹5,000 - ₹10,000 for balance transfer"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1540,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1537,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                lineNumber: 1523,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "content-block",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Tips to Improve Your Home Loan Eligibility"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1545,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Add a Co-Applicant:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1547,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Joint applications with working spouse can increase eligibility by 50-70%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1547,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Close Existing Loans:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1548,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Pay off personal loans and credit cards before applying"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1548,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Improve Credit Score:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1549,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Maintain CIBIL score above 750 for best rates"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1549,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Increase Tenure:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1550,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Opt for 25-30 years to reduce EMI and increase eligibility"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1550,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Show Additional Income:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1551,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Include rental income, business income with proper documentation"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1551,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Opt for Step-Up Loans:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1552,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Some banks offer lower initial EMI with annual increments"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1552,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Larger Down Payment:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1553,
                                                        columnNumber: 19
                                                    }, this),
                                                    " 25-30% down payment can get you better interest rates"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1553,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Choose Right Bank:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1554,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Different banks have different FOIR norms and policies"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1554,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1546,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                lineNumber: 1544,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "content-block",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Tax Benefits on Home Loans in India"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1559,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Home loan borrowers can claim significant tax deductions:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1560,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Section 80C:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1562,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Up to ₹1.5 lakh deduction on principal repayment"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1562,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Section 24(b):"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1563,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Up to ₹2 lakh deduction on interest paid (self-occupied)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1563,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Section 80EEA:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1564,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Additional ₹1.5 lakh interest deduction for first-time buyers"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1564,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Section 80EE:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1565,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Additional ₹50,000 for first-time buyers (loan sanctioned before March 2017)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1565,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1561,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Total maximum tax benefit: Up to ₹5 lakh per year for first-time home buyers!"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1567,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                lineNumber: 1558,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "content-block faq-section",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "India Home Loan Eligibility FAQ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1571,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "faq-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: "How much home loan can I get on ₹50,000 monthly salary?"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1574,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "With ₹50,000 monthly salary (₹6 lakhs annual) and 50% FOIR, you can afford approximately ₹25,000 EMI. At 8.5% interest for 20 years, this translates to approximately ₹30 lakhs loan eligibility. With a co-applicant earning similar income, you could qualify for ₹60 lakhs or more."
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1575,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1573,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "faq-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: "What is the minimum salary required for a home loan in India?"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1583,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Most banks require minimum monthly income of ₹25,000 for salaried individuals in metros, and ₹20,000 in non-metros. Self-employed individuals typically need minimum annual income of ₹3-4 lakhs with proper ITR documentation."
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1584,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1582,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "faq-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: "Do all banks use the same FOIR percentage?"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1591,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "No, FOIR varies by bank and profile. Public sector banks typically use 50-55% FOIR, while private banks and NBFCs may allow up to 60-65% for high-income borrowers. Some banks offer higher FOIR for existing customers with good banking relationships."
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1592,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1590,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "faq-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: "Can I get a home loan with existing personal loan EMI?"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1600,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Yes, but your existing EMI will reduce available home loan eligibility. Banks deduct existing EMIs from your maximum allowable EMI. It's advisable to close high-interest loans (personal loans, credit cards) before applying for home loan to maximize eligibility."
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1601,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1599,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "faq-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: "What is the maximum home loan tenure in India?"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1609,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Maximum tenure is typically 30 years, but it depends on your age. Most banks cap the loan tenure such that it ends by your retirement age (60-65 for salaried, 65-70 for self-employed). For example, a 35-year-old can get 25-30 years tenure, while a 50-year-old may only get 10-15 years."
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1610,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1608,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "faq-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: "Is joint home loan better than individual loan?"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1618,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Yes, joint home loans offer multiple benefits: (1) Combined income increases eligibility by 50-70%, (2) Both applicants can claim tax deductions, (3) Lower interest rates in some cases, (4) Women co-applicants may get 0.05% interest rate concession. However, both applicants are equally liable for repayment."
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1619,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1617,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "faq-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: "How does credit score affect home loan eligibility?"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1627,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "CIBIL score significantly impacts both eligibility and interest rate. Score 750+: Best rates and easy approval. Score 700-749: Good rates with standard approval. Score 650-699: Higher rates, stricter conditions. Below 650: Difficult to get approval, may require co-applicant or larger down payment."
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1628,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1626,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                lineNumber: 1570,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "related-calculators",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Related Home Loan Calculators"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1637,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Explore our other India home loan calculators"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1638,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "calculator-grid",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Link, {
                                                to: "/emi-calculator",
                                                className: "calc-card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        children: "🏠 Home Loan EMI Calculator"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1641,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Calculate monthly EMI with amortization"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1642,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1640,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Link, {
                                                to: "/india/calculators/property-registration",
                                                className: "calc-card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        children: "📋 Property Registration Calculator"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1645,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Stamp duty and registration charges"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1646,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1644,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Link, {
                                                to: "/sip-calculator",
                                                className: "calc-card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        children: "💰 Investment Calculator"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1649,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Plan savings for down payment"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1650,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1648,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Link, {
                                                to: "/calculators",
                                                className: "calc-card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        children: "🧮 All Calculators"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1653,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "View complete calculator collection"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                        lineNumber: 1654,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                                lineNumber: 1652,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                        lineNumber: 1639,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                                lineNumber: 1636,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                        lineNumber: 1456,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AEOContentSection, {
                        tool: "homeloan",
                        country: country
                    }, void 0, false, {
                        fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                        lineNumber: 1660,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                lineNumber: 375,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                type: "application/ld+json",
                children: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "MortgageLoan",
                    "name": "India Home Loan Affordability Calculator",
                    "description": "Calculate home loan eligibility in India based on FOIR, LTV, and RBI guidelines. Includes processing fees, stamp duty, and GST calculations.",
                    "provider": {
                        "@type": "Organization",
                        "name": "VegaKash.AI"
                    },
                    "applicationCategory": "FinanceApplication",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "INR"
                    },
                    "featureList": [
                        "FOIR-based eligibility calculation",
                        "LTV ratio compliance check",
                        "Processing fee estimation",
                        "Stamp duty calculator",
                        "GST calculation for under-construction",
                        "Co-applicant income consideration",
                        "Multiple income source support"
                    ]
                })
            }, void 0, false, {
                fileName: "[project]/src/pages/in/calculators/home-loan-affordability.tsx",
                lineNumber: 1663,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(MortgageAffordabilityCalculatorIndia, "8FEe+Qo6Y197dDVnPQKNqDpW3pI=", false, function() {
    return [
        useParams
    ];
});
_c = MortgageAffordabilityCalculatorIndia;
const __TURBOPACK__default__export__ = MortgageAffordabilityCalculatorIndia;
var _c;
__turbopack_context__.k.register(_c, "MortgageAffordabilityCalculatorIndia");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/in/calculators/home-loan-affordability.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/in/calculators/home-loan-affordability";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/in/calculators/home-loan-affordability.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/in/calculators/home-loan-affordability.tsx\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/in/calculators/home-loan-affordability.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__aa307710._.js.map