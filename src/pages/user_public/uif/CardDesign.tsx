const CardDesign = ({ children }: { children: React.ReactNode }) => {
    return(
         <div className="flex flex-col w-full h-full p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 border border-gray-200 group-hover:border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700">
        {children}
      </div>
    )
}
 
export default CardDesign;