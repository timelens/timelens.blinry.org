def timelens vid, file
    timeline_file = "content/timelines/#{vid}.jpg"
    vtt_file = "content/thumbnails/#{vid}.vtt"
    if not File.exist?(timeline_file) or not File.exist?(vtt_file)
        puts "One of the required files not found."
        print "Running timelens... "
        system("timelens #{file} -w 1000 -h 90 --timeline #{timeline_file} --thumbnails #{vtt_file}")
    end
end

nemo = "videos/nemo.avi"

puts "Processing nemo..."
timelens("nemo", nemo)

vids = IO.read("content/index.slim").scan(/youtube.com\/embed\/([^"]+?)"/).map { |match| match[0] }
#vids << "7FeqF1-Z1g0"

vids.each do |vid|
    file = "videos/#{vid}.mp4"
    puts "Processing #{vid}..."

    if not File.exist?(file)
        puts "Video not found."
        print "Running youtube-dl... "
        system("youtube-dl -f 160 -o #{file} http://www.youtube.com/watch?v=#{vid}")
    end

    timelens(vid, file)
end

id = "6558"
file = "videos/#{id}.mp4"
if not File.exist?(file)
    system("wget https://cdn.media.ccc.de/congress/2014/h264-sd/31c3-6558-de-en-Traue_keinem_Scan_den_du_nicht_selbst_gefaelscht_hast_sd.mp4 -O #{file}")
end
timelens(id, file)

puts "Running examples..."
Dir.chdir("content/assets/examples")
system("timelens ../../../#{nemo} --timeline video.mp4.timeline.jpg")
system("timelens ../../../#{nemo} --timeline timeline.jpg -w 1000 -h 500")
system("timelens ../../../#{nemo} --thumbnails thumbnails.vtt")
