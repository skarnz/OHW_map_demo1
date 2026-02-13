"use client";

interface iOSFrameProps {
  children: React.ReactNode;
}

export default function IOSFrame({ children }: iOSFrameProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-8">
      {/* iPhone 15 Pro Frame */}
      <div className="relative">
        {/* Phone outer shell */}
        <div className="relative w-[393px] h-[852px] bg-[#1a1a1a] rounded-[55px] p-[12px] shadow-2xl border-[3px] border-gray-700">
          {/* Dynamic Island */}
          <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-full z-50" />
          
          {/* Screen bezel */}
          <div className="relative w-full h-full bg-black rounded-[43px] overflow-hidden">
            {/* Status bar area */}
            <div className="absolute top-0 left-0 right-0 h-[54px] z-40 flex items-end justify-between px-8 pb-1">
              <span className="text-white text-sm font-semibold">9:41</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3C7.46 3 3.34 4.78.29 7.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l11 11c.39.39 1.02.39 1.41 0l11-11c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71C20.66 4.78 16.54 3 12 3z"/>
                </svg>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 22h20V2z"/>
                </svg>
                <div className="flex items-center">
                  <div className="w-6 h-3 border border-white rounded-sm relative">
                    <div className="absolute inset-[2px] right-[4px] bg-white rounded-sm" />
                  </div>
                  <div className="w-[2px] h-[6px] bg-white rounded-r-sm ml-[1px]" />
                </div>
              </div>
            </div>
            
            {/* App content */}
            <div className="w-full h-full">
              {children}
            </div>
            
            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-white rounded-full z-50" />
          </div>
        </div>
        
        {/* Side buttons */}
        <div className="absolute -left-[3px] top-[180px] w-[3px] h-[30px] bg-gray-600 rounded-l" />
        <div className="absolute -left-[3px] top-[240px] w-[3px] h-[60px] bg-gray-600 rounded-l" />
        <div className="absolute -left-[3px] top-[310px] w-[3px] h-[60px] bg-gray-600 rounded-l" />
        <div className="absolute -right-[3px] top-[260px] w-[3px] h-[90px] bg-gray-600 rounded-r" />
      </div>
    </div>
  );
}
