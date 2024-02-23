#!/bin/bash

total_time=0
num_runs=3

for ((i=1; i<=$num_runs; i++))
do
    result=$(curl -o /dev/null -s -w "Total time: %{time_total} seconds\n" "$1")
    
    # Extracting the time from the result using awk
    time=$(echo $result | awk '{print $3}' | sed 's/s//')
    
    # Adding the time to the total
    total_time=$(echo "$total_time + $time" | bc)
done

# Calculating the average time
average_time=$(echo "scale=5; $total_time / $num_runs" | bc)

echo "Average Time: $average_time seconds"