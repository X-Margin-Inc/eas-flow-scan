
//@ts-ignore

const NETWORK = import.meta.env.NETWORK; 

export const WarningPage = () => {
  // // Check if the wallet is connected
  return ( 
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl font-bold text-red-600">
        Please connect your wallet to access this page.
      </p>
    </div>
  );


};
