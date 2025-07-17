import { type GetSectionsResponseDto } from "@/api-swagger/models/GetSectionsResponseDto";
import { type GetTitlesResponseDto } from "@/api-swagger/models/GetTitlesResponseDto";
import { type TreeDto } from "@/api-swagger/models/TreeDto";

// Utility to get the next available index
export function getNextAvailableIndex(items: { index: number }[]) {
  const used = new Set(items.map((i) => i.index));
  let idx = 0;
  while (used.has(idx)) idx++;
  return idx;
}

export function renderSubtitlesView(subtitles: TreeDto[]) {
  return (
    <div className="ml-12 my-2 flex flex-col gap-2">
      {subtitles.map((subtitle) => (
        <div
          key={subtitle._id}
          className="p-2 rounded border border-gray-200 bg-gray-50 flex items-center gap-2"
        >
          <span className="text-gray-700 text-sm">{subtitle.fieldName}</span>
        </div>
      ))}
    </div>
  );
}

export function renderTitlesView(titles: GetTitlesResponseDto[]) {
  return (
    <div className="ml-6 my-2 flex flex-col gap-2">
      {titles.map((title) => (
        <div
          key={title._id}
          className="p-3 rounded border border-gray-200 bg-white flex flex-col gap-1"
        >
          <span className="text-gray-900 font-medium text-base">
            {title.fieldName}
          </span>
          {title.subtitles &&
            title.subtitles.length > 0 &&
            renderSubtitlesView(title.subtitles)}
        </div>
      ))}
    </div>
  );
}

export function renderSectionsView(sections: GetSectionsResponseDto[]) {
  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <div
          key={section._id}
          className="p-4 rounded-lg bg-gray-100 border border-gray-200 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-gray-900 font-bold text-lg">
              {section.fieldName}
            </span>
          </div>
          {section.titles &&
            section.titles.length > 0 &&
            renderTitlesView(section.titles)}
        </div>
      ))}
    </div>
  );
}
