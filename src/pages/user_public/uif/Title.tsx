const Title= ({ title }: { title: string }) => {
  return (
   <h2 className="text-md font-bold group-hover:text-primary transition-colors duration-200 dark:text-gray-300 group-hover:dark:text-gray-100">
                        {title}
                      </h2>
  );
}   
export default Title;