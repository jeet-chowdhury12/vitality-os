const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/assistant/AssistantPortal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace subtabs header
const oldTabsStart = content.indexOf('{/* 4 Modular Sub-Tabs */}');
const oldTabsEnd = content.indexOf('{/* TAB 1:');

if (oldTabsStart !== -1 && oldTabsEnd !== -1) {
  // find preceding line of TAB 1
  const prevDivider = content.lastIndexOf('{/* ======================================================== */', oldTabsEnd);
  const replaceStart = oldTabsStart;
  const replaceEnd = prevDivider !== -1 ? prevDivider : oldTabsEnd;

  const newTabs = `{/* 2 Streamlined Triage Sub-Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('triage')}
            className={\`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 \${
              activeTab === 'triage'
                ? 'bg-[#176B65] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }\`}
          >
            <HeartPulse className="w-4 h-4 text-[#35B69A]" />
            <span>1. Vitals Intake & Gemini Multi-Specialist Intake</span>
          </button>

          <button
            onClick={() => setActiveTab('sbar')}
            className={\`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 \${
              activeTab === 'sbar'
                ? 'bg-[#176B65] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }\`}
          >
            <FileText className="w-4 h-4 text-cyan-600" />
            <span>2. SBAR Clinical Handover Protocol</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        `;

  content = content.slice(0, replaceStart) + newTabs + content.slice(replaceEnd);
  console.log('Cleaned subtabs bar successfully');
} else {
  console.log('Subtabs markers not found:', oldTabsStart, oldTabsEnd);
}

// 2. Remove Tab 2 (calculators) & Tab 3 (bedside)
const calcDivider = content.indexOf('{/* TAB 2: EARLY WARNING SCORES');
const sbarDivider = content.indexOf('{/* TAB 4: SBAR NURSING HANDOVER');

if (calcDivider !== -1 && sbarDivider !== -1) {
  const calcStart = content.lastIndexOf('{/* ======================================================== */', calcDivider);
  const sbarStart = content.lastIndexOf('{/* ======================================================== */', sbarDivider);
  content = content.slice(0, calcStart) + content.slice(sbarStart);
  console.log('Removed Tab 2 & Tab 3 successfully');
} else {
  console.log('Tab 2 / Tab 4 dividers not found:', calcDivider, sbarDivider);
}

// 3. Remove Tab 5 (bci)
const bciDivider = content.indexOf('{/* TAB 5: NEURAL BCI');
if (bciDivider !== -1) {
  const bciStart = content.lastIndexOf('{/* ======================================================== */', bciDivider);
  content = content.slice(0, bciStart) + '      </div>\n    </div>\n  );\n}\n';
  console.log('Removed Tab 5 (bci) successfully');
} else {
  console.log('BCI marker not found:', bciDivider);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('AssistantPortal.tsx updated successfully.');
